/* eslint-disable @typescript-eslint/no-non-null-assertion */
import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import Popper, { type PopperProps } from "../Popper";
import { sides } from "../Popper/helpers";
import type { MergeElementProps } from "../typings";
import {
  getSingleChild,
  useControlledProp,
  useEventListener,
  useForkedRefs
} from "../utils";
import useStyles from "./styles";

interface TooltipBaseProps {
  /**
   * The tooltip will be added relative to this node.
   */
  children: React.ReactElement;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The text content of the tooltip.
   */
  text: string;
  /**
   * Tooltip placement. It will be auto updated when `autoPlacement={true}`.
   *
   * @default "top"
   */
  placement?: PopperProps["side"];
  /**
   * By enabling this option, tooltip chooses the placement automatically
   * (the one with the most space available)
   * and ignores the `placement` property value.
   *
   * @default false
   */
  autoPlacement?: PopperProps["autoPlacement"];
  /**
   * The tooltip will be triggered by this event.\
   * **Note**: choosing `"mouseMove"` will disable `autoPlacement` property.
   * @default "hover"
   */
  triggersOn?: "hover" | "click" | "mouseMove";
  /**
   * 	If `true`, the tooltip will have an arrow tail.
   * @default false
   */
  tailed?: boolean;
  /**
   * 	If `true`, the tooltip will be open.
   */
  open?: boolean;
  /**
   * 	If `true`, the tooltip will be open on mount. Use when the component is not controlled.
   */
  defaultOpen?: boolean;
  /**
   * The Callback fires when user has clicked outside of the tooltip.
   */
  onOutsideClick?: (event: MouseEvent) => void;
  /**
   * The Callback fires when the component requests to be closed.
   */
  onClose?: (event: React.SyntheticEvent | Event) => void;
  /**
   * The Callback fires when the component requests to be opened.
   */
  onOpen?: (event: React.SyntheticEvent | Event) => void;
}

export type TooltipProps = Omit<
  MergeElementProps<"div", TooltipBaseProps>,
  "defaultValue" | "defaultChecked"
>;

type Component = {
  (props: TooltipProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TooltipProps> | undefined;
  displayName?: string | undefined;
};

const allowedPlacements = sides;
const allowedTriggerEvents = ["hover", "click", "mouseMove"] as const;

const getDocument = () => (typeof document === "undefined" ? null : document);

const TooltipBase = (props: TooltipProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    children,
    className,
    text,
    defaultOpen,
    onOpen,
    onClose,
    onOutsideClick,
    open: openProp,
    autoPlacement = false,
    tailed = false,
    placement = "top",
    triggersOn = "hover",
    ...otherProps
  } = props;

  const classes = useStyles();

  const tooltipRef = React.useRef<HTMLDivElement>();
  const anchorRef = React.useRef<HTMLElement>();
  const tooltipRefHandle = useForkedRefs(tooltipRef, ref);

  const [open, setOpen] = useControlledProp(openProp, defaultOpen, false);
  const [coordinates, setCoordinates] = React.useState({ x: 0, y: 0 });

  const popperActions: PopperProps["actions"] = React.useRef(null);

  const outsideClickHandler = React.useCallback(
    (e: MouseEvent) => {
      if (
        anchorRef.current != null &&
        anchorRef.current !== e.target &&
        !anchorRef.current.contains(e.target as HTMLElement) &&
        tooltipRef.current != null &&
        tooltipRef.current !== e.target &&
        !tooltipRef.current.contains(e.target as HTMLElement)
      ) {
        if (onOutsideClick) onOutsideClick(e);
      }
    },
    [onOutsideClick]
  );

  useEventListener(
    {
      target: getDocument(),
      eventType: "mousedown",
      handler: outsideClickHandler,
      options: { capture: true }
    },
    open && onOutsideClick != null
  );

  const child = getSingleChild(children, "Tooltip");

  if (!child) return null;

  const createAnchorListeners = ():
    | React.ComponentPropsWithoutRef<"div">
    | undefined => {
    const childProps = child.props as React.ComponentPropsWithoutRef<"div">;

    switch (triggersOn) {
      case "click":
        return {
          onClick: e => {
            if (open) void (onClose?.(e), setOpen(false));
            else void (onOpen?.(e), setOpen(true));

            childProps.onClick?.(e);
          }
        };
      case "hover": {
        return {
          onMouseEnter: e =>
            void (onOpen?.(e), setOpen(true), childProps.onMouseEnter?.(e)),
          onMouseLeave: e =>
            void (onClose?.(e), setOpen(false), childProps.onMouseLeave?.(e))
        };
      }
      case "mouseMove": {
        return {
          onMouseEnter: e =>
            void (onOpen?.(e), setOpen(true), childProps.onMouseEnter?.(e)),
          onMouseLeave: e =>
            void (onClose?.(e), setOpen(false), childProps.onMouseLeave?.(e)),
          onMouseMove: e => {
            setCoordinates({ x: e.clientX, y: e.clientY });
            popperActions.current?.recompute();

            childProps.onMouseMove?.(e);
          }
        };
      }
      default:
        return;
    }
  };

  const createVirtualAnchor = (): NonNullable<
    PopperProps["virtualAnchor"]
  > => ({
    getBoundingClientRect: () => ({
      width: 0,
      height: 0,
      x: coordinates.x,
      y: coordinates.y,
      top: coordinates.y,
      left: coordinates.x,
      right: coordinates.x,
      bottom: coordinates.y
    })
  });

  return (
    <Popper
      {...otherProps}
      open={open}
      ref={tooltipRefHandle}
      role="tooltip"
      side={placement}
      actions={popperActions}
      autoPlacement={triggersOn === "mouseMove" ? false : autoPlacement}
      className={c(className, classes.root, { [classes.tailed]: tailed })}
      offset={triggersOn === "mouseMove" ? 32 : undefined}
      virtualAnchor={
        triggersOn === "mouseMove" ? createVirtualAnchor() : undefined
      }
      renderPopperContent={currentPlacement => (
        <div
          className={c(
            classes.content,
            classes[currentPlacement as typeof placement]
          )}
        >
          <div className={classes.container}>
            <span className={classes.text}>{text}</span>
          </div>
          <div className={classes.tail}></div>
        </div>
      )}
    >
      {React.cloneElement(child, createAnchorListeners())}
    </Popper>
  );
};

const Tooltip = React.forwardRef(TooltipBase) as Component;

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  tailed: PropTypes.bool,
  autoPlacement: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onOutsideClick: PropTypes.func,
  placement: PropTypes.oneOf(allowedPlacements),
  triggersOn: PropTypes.oneOf(allowedTriggerEvents)
};

export default Tooltip;
