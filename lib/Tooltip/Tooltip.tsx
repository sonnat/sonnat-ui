/* eslint-disable @typescript-eslint/no-non-null-assertion */
import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import PortalDestination from "../PortalDestination";
import type { MergeElementProps } from "../typings";
import {
  getOffsetFromWindow,
  onNextFrame,
  setRef,
  useControlledProp,
  useEventListener,
  useForkedRefs,
  useId,
  usePreviousValue
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
   * Tooltip placement. It will be auto updated when it collide with the window.
   * @default "top"
   */
  placement?: "left" | "right" | "top" | "bottom";
  /**
   * 	The tooltip will be triggered by this event.
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

const allowedPlacements = ["left", "right", "top", "bottom"] as const;
const allowedTriggerEvents = ["hover", "click", "mouseMove"] as const;

const isSSR = typeof window === "undefined";

const getMirrorPlacement = (placement: TooltipProps["placement"]) => {
  switch (placement) {
    case "top":
      return "bottom";
    case "bottom":
      return "top";
    case "left":
      return "right";
    case "right":
      return "left";
    default:
      return void 0;
  }
};

const createAnchorElement = (
  children: React.ReactElement,
  reference: React.Ref<HTMLElement | undefined>,
  listeners: {
    onClick: (e: MouseEvent) => void;
    onMouseEnter: (e: MouseEvent) => void;
    onMouseLeave: (e: MouseEvent) => void;
    onMouseMove: (e: MouseEvent) => void;
  },
  triggersOn: TooltipProps["triggersOn"] = "hover"
) => {
  let anchorElement;
  let childrenProps: Partial<typeof listeners>;

  if (children != null && React.isValidElement(children)) {
    try {
      anchorElement = React.Children.only(children);
      childrenProps = children.props as typeof listeners;
    } catch (err) {
      throw new Error(
        `[Sonnat] The \`children\` prop has to be a single valid element.`
      );
    }
  } else {
    throw new Error(
      `[Sonnat] The \`children\` prop has to be a single valid element.`
    );
  }

  type Children = { ref?: React.Ref<HTMLElement> };

  const childrenAditionalProps: Partial<typeof listeners> & {
    ref: (node: HTMLElement | null) => void;
  } = {
    ref: (node: HTMLElement | null) => {
      setRef(reference, node);
      (children as Children).ref && setRef((children as Children).ref!, node);
    }
  };

  switch (triggersOn) {
    case "click": {
      childrenAditionalProps.onClick = e => {
        listeners.onClick(e);
        childrenProps.onClick?.(e);
      };
      break;
    }
    case "hover": {
      childrenAditionalProps.onMouseEnter = e => {
        listeners.onMouseEnter(e);
        childrenProps.onMouseEnter?.(e);
      };
      childrenAditionalProps.onMouseLeave = e => {
        listeners.onMouseLeave(e);
        childrenProps.onMouseLeave?.(e);
      };
      break;
    }
    case "mouseMove": {
      childrenAditionalProps.onMouseEnter = e => {
        listeners.onMouseEnter(e);
        childrenProps.onMouseEnter?.(e);
      };
      childrenAditionalProps.onMouseMove = e => {
        listeners.onMouseMove(e);
        childrenProps.onMouseMove?.(e);
      };
      childrenAditionalProps.onMouseLeave = e => {
        listeners.onMouseLeave(e);
        childrenProps.onMouseLeave?.(e);
      };
      break;
    }
    default:
      return;
  }

  return React.cloneElement(anchorElement, childrenAditionalProps);
};

const checkBoundingCollision = (
  x: number,
  y: number,
  w: number,
  h: number,
  placement: TooltipProps["placement"],
  triggersOn: TooltipProps["triggersOn"] = "hover"
) => {
  const minX = 0;
  const minY = 0;
  const maxX = document.body.scrollWidth;
  const maxY = document.body.scrollHeight;

  const state = { horizontal: true, vertical: true, left: false, right: false };

  if (minX <= x && x + w <= maxX) state.horizontal = false;
  else {
    if (minX > x) state.left = true;
    else state.right = true;
  }

  if (minY <= y) {
    if (triggersOn !== "mouseMove" && placement === "bottom") {
      if (y + h <= maxY) state.vertical = false;
    } else state.vertical = false;
  }

  return state;
};

const getPosition = (
  placement: TooltipProps["placement"],
  tooltipElement: HTMLDivElement,
  anchorElement: HTMLElement
) => {
  const targetOffset = getOffsetFromWindow(anchorElement);
  const targetRect = anchorElement.getBoundingClientRect();
  const tooltipRect = tooltipElement.getBoundingClientRect();

  const tooltipWidth = tooltipRect.width;
  const tooltipHeight = tooltipRect.height;

  switch (placement) {
    case "left":
      return {
        top: targetOffset.top + targetRect.height / 2 - tooltipHeight / 2,
        left: targetOffset.left - tooltipWidth
      };
    case "right":
      return {
        top: targetOffset.top + targetRect.height / 2 - tooltipHeight / 2,
        left: targetOffset.left + targetRect.width
      };
    case "bottom":
      return {
        top: targetOffset.top + targetRect.height,
        left: targetOffset.left + targetRect.width / 2 - tooltipWidth / 2
      };
    case "top":
    default:
      return {
        top: targetOffset.top - tooltipHeight,
        left: targetOffset.left + targetRect.width / 2 - tooltipWidth / 2
      };
  }
};

// in case of collisions change placement and rePosition tooltip based on that newPlacement
const newPositioning = (
  position: { top: number; left: number },
  placement: TooltipProps["placement"],
  collisionState: ReturnType<typeof checkBoundingCollision>,
  tooltipElement: HTMLDivElement,
  anchorElement: HTMLElement
) => {
  let newPosition = position;
  let newPlacement = placement;

  if (collisionState.vertical) {
    newPlacement = getMirrorPlacement(placement);
    newPosition = getPosition(newPlacement, tooltipElement, anchorElement);
  } else if (collisionState.horizontal) {
    if (collisionState.left) {
      newPlacement = "right";
      newPosition = getPosition(newPlacement, tooltipElement, anchorElement);
    } else if (collisionState.right) {
      newPlacement = "left";
      newPosition = getPosition(newPlacement, tooltipElement, anchorElement);
    }
  }

  return { newPosition, newPlacement };
};

const positioning = (
  placement: TooltipProps["placement"],
  tooltipElement: HTMLDivElement,
  anchorElement: HTMLElement
) => {
  const position = getPosition(placement, tooltipElement, anchorElement);

  const tooltipRect = tooltipElement.getBoundingClientRect();

  const tooltipWidth = tooltipRect.width;
  const tooltipHeight = tooltipRect.height;

  const x = position.left - tooltipWidth / 2;
  const y = position.top - tooltipHeight;

  const collisionState = checkBoundingCollision(
    x,
    y,
    tooltipWidth,
    tooltipHeight,
    placement
  );

  return newPositioning(
    position,
    placement,
    collisionState,
    tooltipElement,
    anchorElement
  );
};

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
    style = {},
    tailed = false,
    placement = "top",
    triggersOn = "hover",
    ...otherProps
  } = props;

  const classes = useStyles();
  const uniqueId = useId(undefined, "TOOLTIP");

  const isInitialized = React.useRef(false);

  const tooltipRef = React.useRef<HTMLDivElement>();
  const anchorRef = React.useRef<HTMLElement>();
  const tooltipRefHandle = useForkedRefs(tooltipRef, ref);

  const prevPlacement = usePreviousValue(placement);

  const [currentPlacement, setCurrentPlacement] = React.useState(placement);
  const [currentPosition, setCurrentPositon] = React.useState({
    top: 0,
    left: 0
  });

  const [open, setOpen] = useControlledProp(openProp, defaultOpen, false);

  React.useEffect(() => {
    if (!isInitialized.current) {
      onNextFrame(() => {
        isInitialized.current = true;

        if (!tooltipRef.current || !anchorRef.current) return;

        const { newPlacement, newPosition } = positioning(
          placement,
          tooltipRef.current,
          anchorRef.current
        );

        setCurrentPositon(newPosition);
        setCurrentPlacement(newPlacement!);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement]);

  React.useEffect(() => {
    if (!tooltipRef.current || !anchorRef.current) return;
    if (isInitialized.current && prevPlacement !== placement) {
      const { newPlacement, newPosition } = positioning(
        placement,
        tooltipRef.current,
        anchorRef.current
      );

      setCurrentPositon(newPosition);
      setCurrentPlacement(newPlacement!);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placement, prevPlacement]);

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

  const anchorElement = createAnchorElement(
    children,
    anchorRef,
    {
      onClick: (e: MouseEvent) => {
        if (!tooltipRef.current || !anchorRef.current) return;

        const { newPlacement, newPosition } = positioning(
          placement,
          tooltipRef.current,
          anchorRef.current
        );

        setCurrentPositon(newPosition);
        setCurrentPlacement(newPlacement!);

        if (open) {
          if (onClose) onClose(e);
          setOpen(false);
        } else {
          if (onOpen) onOpen(e);
          setOpen(true);
        }
      },
      onMouseEnter: (e: MouseEvent) => {
        if (!tooltipRef.current || !anchorRef.current) return;

        const { newPlacement, newPosition } = positioning(
          placement,
          tooltipRef.current,
          anchorRef.current
        );

        setCurrentPositon(newPosition);
        setCurrentPlacement(newPlacement!);

        if (onOpen) onOpen(e);
        setOpen(true);
      },
      onMouseLeave: (e: MouseEvent) => {
        if (onClose) onClose(e);
        setOpen(false);
      },
      onMouseMove: (e: MouseEvent) => {
        if (!tooltipRef.current) return;

        const tooltipRect = tooltipRef.current.getBoundingClientRect();

        const tooltipWidth = tooltipRect.width;
        const tooltipHeight = tooltipRect.height;

        let x = e.pageX - tooltipWidth / 2;
        let y = e.pageY - tooltipHeight;

        setCurrentPositon({ left: x, top: y });

        const collisionState = checkBoundingCollision(
          x,
          y,
          tooltipWidth,
          tooltipHeight,
          currentPlacement,
          triggersOn
        );

        if (collisionState.vertical) {
          y = e.pageY;
          setCurrentPlacement("bottom");
        } else if (collisionState.horizontal) {
          y = e.pageY - tooltipHeight / 2;

          if (collisionState.left) {
            x = e.pageX;
            setCurrentPlacement("right");
          } else if (collisionState.right) {
            x = e.pageX - tooltipWidth;
            setCurrentPlacement("left");
          }
        } else setCurrentPlacement("top");
      }
    },
    triggersOn
  );

  if (!isSSR) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEventListener(
      {
        target: document,
        eventType: "mousedown",
        handler: outsideClickHandler,
        options: { capture: true }
      },
      open && onOutsideClick != null
    );
  }

  return (
    <React.Fragment>
      <PortalDestination aria-hidden={!open}>
        <div
          tabIndex={-1}
          role="tooltip"
          ref={tooltipRefHandle}
          id={uniqueId}
          style={{
            left: currentPosition.left,
            top: currentPosition.top,
            ...style
          }}
          className={c(classes.root, className, {
            [classes[currentPlacement]]: triggersOn !== "mouseMove",
            [classes.tailed]: triggersOn !== "mouseMove" && tailed,
            [classes.open]: open,
            [classes.floated]: triggersOn === "mouseMove"
          })}
          {...otherProps}
        >
          <div className={classes.container}>
            <span className={classes.text}>{text}</span>
          </div>
          <div className={classes.tail}></div>
        </div>
      </PortalDestination>
      {anchorElement}
    </React.Fragment>
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
  style: PropTypes.object,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onOutsideClick: PropTypes.func,
  placement: PropTypes.oneOf(allowedPlacements),
  triggersOn: PropTypes.oneOf(allowedTriggerEvents)
};

export default Tooltip;
