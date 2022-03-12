import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import PortalDestination from "../PortalDestination";
import useTheme from "../styles/useTheme";
import type { MergeElementProps } from "../typings";
import {
  getSingleChild,
  setRef,
  useConstantProp,
  useForkedRefs,
  useId,
  useIsomorphicLayoutEffect,
  useOnChange
} from "../utils";
import {
  alignments,
  computePosition,
  sides,
  strategies,
  type Alignment,
  type AutoPlacementMiddleware,
  type ComputationMiddleware,
  type ComputationMiddlewareOrder,
  type Coordinates,
  type OffsetMiddleware,
  type Placement,
  type Side,
  type Strategy,
  type VirtualElement
} from "./helpers";
import useStyles from "./styles";

interface PopperBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * This element will work as an anchor for the popper,
   * unless you opt-in the `virtualAnchor` property.
   */
  children?: React.ReactElement;
  /**
   * If `true`, the popper will be open.
   */
  open: boolean;
  /**
   * Renders the content of the popper.
   */
  renderPopperContent?: (finalPlacement: Placement) => React.ReactNode;
  /**
   * The popper positioning side.
   *
   * @default "top"
   */
  side?: Side;
  /**
   * The popper positioning alignment.
   *
   * @default "middle"
   */
  alignment?: Alignment | "middle";
  /**
   * By enabling this option, popper chooses the placement automatically
   * (the one with the most space available)
   * and ignores the `side` property value but will consider the `alignment` value.
   *
   * @default false
   */
  autoPlacement?: AutoPlacementMiddleware;
  /**
   * The type of CSS positioning strategy to use.
   * You will want to use `fixed` if your anchor element is inside a fixed container
   *
   * @default "absolute"
   */
  positioningStrategy?: Strategy;
  /**
   * If a number is provided, it will represent the `mainAxis` offset.
   *
   * The `mainAxis` indicates x-axis
   * when the `placement` is equal to any combination of `top` or `bottom`.
   * In other cases it indicates the y-axis.
   *
   * Accordingly, the `crossAxis` works opposite to the `mainAxis`.
   *
   * @default 8
   */
  offset?: OffsetMiddleware;
  /**
   * A callback that runs as an in-between "middle" step of
   * the placement computation and eventual return.
   *
   * It should return an object containing either new coordinates or a new placement.\
   * (**Note**: You can't return both of them!)
   *
   * You can control the execution order of this callback via `computationMiddlewareOrder`
   * property.
   */
  computationMiddleware?: ComputationMiddleware;
  /**
   * Controls the execution order of `computationMiddleware`.
   *
   * @default "afterAutoPlacement"
   */
  computationMiddlewareOrder?: ComputationMiddlewareOrder;
  /**
   * The actions you can perform on the popper instance.
   */
  actions?: React.RefObject<{
    /**
     * Re-runs the positioning computation process.
     */
    recompute: () => void;
  }>;
  /**
   * Works as an anchor for the popper.\
   * This enables things like positioning context menus or following the cursor.
   *
   * **Note**: If both `children` and `virtualAnchor` was provided,
   * popper will use the `virtualAnchor` as the main anchor.
   */
  virtualAnchor?: HTMLElement | VirtualElement;
}

export type PopperProps = MergeElementProps<"div", PopperBaseProps>;

type Component = {
  (props: PopperProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<PopperProps> | undefined;
  displayName?: string | undefined;
};

const translate = ({ x, y }: Coordinates) => {
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1;

  // Rounding coordinates by DPR
  const { x: _x, y: _y } = (() => ({
    x: Math.round(Math.round(x * dpr) / dpr),
    y: Math.round(Math.round(y * dpr) / dpr)
  }))();

  const transformValue = `translate(${_x}px, ${_y}px)`;

  return {
    transform: transformValue,
    WebkitTransform: transformValue,
    MozTransform: transformValue,
    msTransform: transformValue
  };
};

const PopperBase = (props: PopperProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    open,
    className,
    children,
    actions,
    offset = 8,
    style,
    renderPopperContent,
    computationMiddleware,
    virtualAnchor,
    side: sideProp,
    autoPlacement = false,
    alignment: alignmentProp,
    positioningStrategy: strategyProp,
    computationMiddlewareOrder: middlewareOrder,
    ...otherProps
  } = props;

  const classes = useStyles();

  const isRtl = useTheme().direction === "rtl";
  const uniqueId = useId(undefined, "POPPER");

  const anchorRef = React.useRef<HTMLElement>();
  const popperRef = React.useRef<HTMLDivElement>(null);
  const handlePopperRef = useForkedRefs(ref, popperRef);

  const initiallyRendered = React.useRef(false);

  const [coordinates, setCoordinates] = React.useState<Coordinates>({
    x: 0,
    y: 0
  });

  const strategy = useConstantProp(strategyProp, "absolute" as Strategy, {
    componentName: "Popper",
    propName: "positioningStrategy",
    notNullable: true
  });

  const computationMiddlewareOrder = useConstantProp(
    middlewareOrder,
    "afterAutoPlacement" as ComputationMiddlewareOrder,
    {
      componentName: "Popper",
      propName: "computationMiddlewareOrder",
      notNullable: true
    }
  );

  const side = useConstantProp(sideProp, "top" as Side, {
    componentName: "Popper",
    propName: "side",
    notNullable: true
  });

  const alignment = useConstantProp(
    alignmentProp,
    "middle" as Alignment | "middle",
    { componentName: "Popper", propName: "alignment", notNullable: true }
  );

  const { current: initialPlacement } = React.useRef<Placement>(
    alignment === "middle" ? side : `${side}-${alignment}`
  );

  const [placement, setPlacement] = React.useState(initialPlacement);

  const compute = () => {
    if ((virtualAnchor || anchorRef.current) && popperRef.current) {
      const {
        x,
        y,
        placement: newPlacement
      } = computePosition(
        (virtualAnchor ?? anchorRef.current) as HTMLElement | VirtualElement,
        popperRef.current,
        {
          computationMiddleware,
          computationMiddlewareOrder,
          placement: initialPlacement,
          autoPlacement,
          offset,
          strategy,
          isRtl
        }
      );

      setPlacement(newPlacement);
      setCoordinates({ x, y });

      return true;
    }

    return false;
  };

  useOnChange(open, isOpen => void (isOpen && compute()));

  React.useImperativeHandle(actions, () => ({
    recompute: (): void => void compute()
  }));

  const child = children ? getSingleChild(children, "Popper") : null;

  useIsomorphicLayoutEffect(() => {
    if (!initiallyRendered.current) initiallyRendered.current = compute();
  });

  if (!child && !virtualAnchor) {
    // eslint-disable-next-line no-console
    console.error(
      [
        "Sonnat: You have to either provide `virtualAnchor` or `children` property",
        "in order to make the popper work."
      ].join(" ")
    );

    return null;
  }

  const createAnchorElement = (child: React.ReactElement) => {
    const anchorProps = {
      "aria-describedby": uniqueId,
      ref: (node: HTMLElement | null) => {
        setRef(anchorRef, node);

        type WithRefType = { ref?: React.Ref<HTMLElement> };
        const childRef = (child as WithRefType).ref;

        if (childRef) setRef(childRef, node);
      }
    };

    return React.cloneElement(child, anchorProps);
  };

  return (
    <React.Fragment>
      <PortalDestination aria-hidden={!open}>
        <div
          {...otherProps}
          tabIndex={-1}
          ref={handlePopperRef}
          id={uniqueId}
          style={{ ...style, ...translate(coordinates), left: 0, top: 0 }}
          className={c(className, classes.root, classes[strategy], {
            [classes.open]: open
          })}
        >
          {renderPopperContent?.(placement)}
        </div>
      </PortalDestination>
      {virtualAnchor ? child : createAnchorElement(child as React.ReactElement)}
    </React.Fragment>
  );
};

const Popper = React.forwardRef(PopperBase) as Component;

type InferredTypeMap = React.WeakValidationMap<PopperProps>;

Popper.propTypes = {
  children: PropTypes.element,
  className: PropTypes.string,
  open: PropTypes.bool.isRequired,
  side: PropTypes.oneOf(sides),
  alignment: PropTypes.oneOf([...alignments, "middle"]),
  positioningStrategy: PropTypes.oneOf(strategies),
  renderPopperContent: PropTypes.func,
  autoPlacement: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.exact({
      excludeSides: PropTypes.arrayOf((propValue, key) => {
        if (sides.includes(propValue[key] as Side)) return null;
        return new Error();
      }).isRequired
    })
  ]) as InferredTypeMap["autoPlacement"],
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.exact({
      mainAxis: PropTypes.number,
      crossAxis: PropTypes.number
    })
  ]) as InferredTypeMap["offset"],
  computationMiddleware: PropTypes.func,
  actions: PropTypes.exact({
    current: PropTypes.exact({ recompute: PropTypes.func.isRequired })
  }) as InferredTypeMap["actions"]
};

export default Popper;
