import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import PortalDestination from "../PortalDestination";
import makeStyles from "../styles/makeStyles";
import {
  useControlled,
  generateUniqueString,
  getOffsetFromWindow,
  onNextFrame,
  useForkRef,
  setRef
} from "../utils";

const componentName = "Tooltip";
const allowedPlacements = ["left", "right", "top", "bottom"];
const allowedTriggerEvents = ["hover", "click", "mouseMove"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      zIndexes,
      direction,
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        opacity: 0,
        maxWidth: pxToRem(192),
        minWidth: pxToRem(56),
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: zIndexes.popover,
        position: "absolute",
        pointerEvents: "none",
        MozBackfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        backfaceVisibility: "hidden",
        transform: "translate(0, 0) scale(0.8)",
        transition:
          "transform 360ms cubic-bezier(0, 0, 0.2, 1) 100ms, opacity 200ms ease 100ms"
      },
      container: {
        padding: [[pxToRem(8), pxToRem(12)]],
        borderRadius: pxToRem(4),
        position: "relative",
        zIndex: 2,
        display: "flex",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: !darkMode
          ? colors.pallete.grey[900]
          : colors.pallete.grey[700],
        "&:before": {
          content: '""',
          width: "100%",
          height: "100%",
          position: "absolute",
          top: "0",
          left: "0",
          borderRadius: pxToRem(4),
          boxShadow: `0 2px 8px 0 rgba(0, 0, 0, 0.12)`,
          zIndex: -1
        },
        "&:after": {
          position: "absolute",
          width: pxToRem(12),
          height: pxToRem(12),
          backgroundColor: !darkMode
            ? colors.pallete.grey[900]
            : colors.pallete.grey[700],
          zIndex: -1
        }
      },
      text: useText({
        fontSize: pxToRem(12),
        color: colors.white
      }),
      tail: {
        width: pxToRem(12),
        height: pxToRem(12),
        backgroundColor: colors.transparent,
        position: "absolute",
        zIndex: 1,
        opacity: 0,
        visibility: "hidden",
        transition: "opacity 200ms ease 100ms, visibility 200ms ease 100ms",
        "&:before": {
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
          boxShadow: `2px 2px 8px 0 rgba(0, 0, 0, 0.16)`,
          zIndex: -1
        }
      },
      open: {
        opacity: 0.96,
        "&$tailed": {
          "&$top": { transform: `translate(0, ${pxToRem(-16)}) scale(1)` },
          "&$bottom": { transform: `translate(0, ${pxToRem(16)}) scale(1)` },
          "&$right": { transform: `translate(${pxToRem(16)}, 0) scale(1)` },
          "&$left": { transform: `translate(${pxToRem(-16)}, 0) scale(1)` }
        }
      },
      tailed: {
        "& $container:after, & $container:before": {
          content: '""'
        },
        "& $tail": {
          opacity: 1,
          visibility: "visible",
          "&:before": { content: '""' }
        },
        "&$top": {
          "& $container:after": {
            borderRadius: "0",
            borderBottomRightRadius: pxToRem(2),
            transform: "translateY(50%) rotate(45deg)",
            bottom: "0"
          },
          "& $tail": {
            transform: "translateY(50%) rotate(45deg)",
            bottom: "0",
            "&:before": {
              borderRadius: "0",
              borderBottomRightRadius: pxToRem(2)
            }
          }
        },
        "&$right": {
          "& $container:after": {
            borderRadius: "0",
            borderBottomLeftRadius: pxToRem(2),
            transform: "translateX(-50%) rotate(45deg)",
            left: "0"
          },
          "& $tail": {
            transform: "translateX(-50%) rotate(45deg)",
            left: "0",
            "&:before": {
              borderRadius: "0",
              borderBottomLeftRadius: pxToRem(2)
            }
          }
        },
        "&$left": {
          "& $container:after": {
            borderRadius: "0",
            borderTopRightRadius: pxToRem(2),
            transform: "translateX(50%) rotate(45deg)",
            right: "0"
          },
          "& $tail": {
            transform: "translateX(50%) rotate(45deg)",
            right: "0",
            "&:before": {
              borderRadius: "0",
              borderTopRightRadius: pxToRem(2)
            }
          }
        },
        "&$bottom": {
          "& $container:after": {
            borderRadius: "0",
            borderTopLeftRadius: pxToRem(2),
            transform: "translateY(-50%) rotate(45deg)",
            top: "0"
          },
          "& $tail": {
            transform: "translateY(-50%) rotate(45deg)",
            top: "0",
            "&:before": {
              borderRadius: "0",
              borderTopLeftRadius: pxToRem(2)
            }
          }
        }
      },
      dark: {
        "& $container": {
          backgroundColor: colors.pallete.grey[900],
          "&:after": { backgroundColor: colors.pallete.grey[900] }
        },
        "& $text": { color: colors.white }
      },
      floated: { transform: `translate(0, ${pxToRem(-8)}) scale(1)` },
      top: { transform: `translate(0, ${pxToRem(-8)}) scale(1)` },
      left: { transform: `translate(${pxToRem(-8)}, 0) scale(1)` },
      right: { transform: `translate(${pxToRem(8)}, 0) scale(1)` },
      bottom: { transform: `translate(0, ${pxToRem(8)}) scale(1)` }
    };
  },
  { name: `Sonnat${componentName}` }
);

const getMirrorPlacement = placement => {
  switch (placement) {
    case "top":
      return "bottom";
    case "bottm":
      return "top";
    case "left":
      return "right";
    case "right":
      return "left";
  }
};

const createAnchorElement = (
  children,
  { triggersOn = "hover", reference },
  listeners = {}
) => {
  let anchorElement;
  let childrenProps = {};

  if (children != null && React.isValidElement(children)) {
    try {
      anchorElement = React.Children.only(children);
      childrenProps = children.props;
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

  const childrenAditionalProps = {
    ref: node => {
      setRef(reference, node);
      setRef(children.ref, node);
    }
  };

  if (allowedTriggerEvents.includes(triggersOn)) {
    switch (triggersOn) {
      case "click":
        childrenAditionalProps.onClick = e => {
          listeners.onClick(e);
          if (childrenProps.onClick) childrenProps.onClick(e);
        };
        break;
      case "hover":
        childrenAditionalProps.onMouseEnter = e => {
          listeners.onMouseEnter(e);
          if (childrenProps.onMouseEnter) childrenProps.onMouseEnter(e);
        };
        childrenAditionalProps.onMouseLeave = e => {
          listeners.onMouseLeave(e);
          if (childrenProps.onMouseLeave) childrenProps.onMouseLeave(e);
        };
        break;
      case "mouseMove":
        childrenAditionalProps.onMouseEnter = e => {
          listeners.onMouseEnter(e);
          if (childrenProps.onMouseEnter) childrenProps.onMouseEnter(e);
        };
        childrenAditionalProps.onMouseMove = e => {
          listeners.onMouseMove(e);
          if (childrenProps.onMouseMove) childrenProps.onMouseMove(e);
        };
        childrenAditionalProps.onMouseLeave = e => {
          listeners.onMouseLeave(e);
          if (childrenProps.onMouseLeave) childrenProps.onMouseLeave(e);
        };
        break;
    }
  }

  return React.cloneElement(anchorElement, { ...childrenAditionalProps });
};

const checkBoundingCollision = (x, y, w, h, placement, triggersOn) => {
  const minX = 0;
  const minY = 0;
  const maxX = window.innerWidth;
  const maxY = window.innerHeight;

  const state = { horizontal: true, vertical: true };

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

const getPosition = (placement, tooltipElement, anchorElement) => {
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
  position,
  placement,
  collisionState,
  { tooltip, anchor }
) => {
  let newPosition = position;
  let newPlacement = placement;

  if (collisionState.vertical) {
    newPlacement = getMirrorPlacement(placement);
    newPosition = getPosition(newPlacement, tooltip, anchor);
  } else if (collisionState.horizontal) {
    if (collisionState.left) {
      newPlacement = "right";
      newPosition = getPosition(newPlacement, tooltip, anchor);
    } else if (collisionState.right) {
      newPlacement = "left";
      newPosition = getPosition(newPlacement, tooltip, anchor);
    }
  }

  return { newPosition, newPlacement };
};

const positioning = (placement, tooltipElement, anchorElement) => {
  let position = getPosition(placement, tooltipElement, anchorElement);

  const tooltipRect = tooltipElement.getBoundingClientRect();
  const tooltipWidth = tooltipRect.width,
    tooltipHeight = tooltipRect.height;
  let x = position.left - tooltipWidth / 2,
    y = position.top - tooltipHeight;

  const collisionState = checkBoundingCollision(
    x,
    y,
    tooltipWidth,
    tooltipHeight,
    placement
  );

  return newPositioning(position, placement, collisionState, {
    tooltip: tooltipElement,
    anchor: anchorElement
  });
};

const Tooltip = React.memo(
  React.forwardRef(function Tooltip(props, ref) {
    const {
      children,
      className,
      text,
      defaultOpen,
      onOpen,
      onClose,
      open: openProp,
      style = {},
      tailed = false,
      dark = false,
      placement = "top",
      triggersOn = "hover",
      ...otherProps
    } = props;

    const localClass = useStyles();

    const uniqueId = React.useRef(`tooltip${generateUniqueString()}`);

    const isInitialized = React.useRef(false);

    const tooltipRef = React.useRef();
    const anchorRef = React.useRef();
    const tooltipRefHandle = useForkRef(tooltipRef, ref);

    const [isMounted, setMounted] = React.useState(false);
    const [currentPosition, setCurrentPositon] = React.useState({
      top: 0,
      left: 0
    });
    const [currentPlacement, setCurrentPlacement] = React.useState(placement);

    const [open, setOpen] = useControlled(
      openProp,
      openProp == null && defaultOpen == null ? false : defaultOpen,
      componentName
    );

    React.useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    React.useEffect(() => {
      if (
        isMounted &&
        !isInitialized.current &&
        tooltipRef.current &&
        anchorRef.current
      ) {
        onNextFrame(() => {
          isInitialized.current = true;

          const { newPlacement, newPosition } = positioning(
            placement,
            tooltipRef.current,
            anchorRef.current
          );

          setCurrentPositon(newPosition);
          setCurrentPlacement(newPlacement);
        });
      }
    }, [isMounted, placement]);

    const anchorElement = createAnchorElement(
      children,
      { triggersOn, reference: anchorRef },
      {
        onClick: e => {
          const { newPlacement, newPosition } = positioning(
            placement,
            tooltipRef.current,
            anchorRef.current
          );

          setCurrentPositon(newPosition);
          setCurrentPlacement(newPlacement);

          if (open) {
            if (onClose) onClose(e);
            setOpen(false);
          } else {
            if (onOpen) onOpen(e);
            setOpen(true);
          }
        },
        onMouseEnter: e => {
          const { newPlacement, newPosition } = positioning(
            placement,
            tooltipRef.current,
            anchorRef.current
          );

          setCurrentPositon(newPosition);
          setCurrentPlacement(newPlacement);

          if (onOpen) onOpen(e);
          setOpen(true);
        },
        onMouseLeave: e => {
          if (onClose) onClose(e);
          setOpen(false);
        },
        onMouseMove: e => {
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
      }
    );

    return (
      <React.Fragment>
        <PortalDestination aria-hidden={!open}>
          <div
            tabIndex="-1"
            role="tooltip"
            ref={tooltipRefHandle}
            id={uniqueId.current}
            style={{
              left: currentPosition.left,
              top: currentPosition.top,
              ...style
            }}
            className={createClass(localClass.root, className, {
              [localClass[currentPlacement]]: triggersOn !== "mouseMove",
              [localClass.tailed]: triggersOn !== "mouseMove" && tailed,
              [localClass.open]: open,
              [localClass.dark]: dark,
              [localClass.floated]: triggersOn === "mouseMove"
            })}
            {...otherProps}
          >
            <div className={localClass.container}>
              <span className={localClass.text}>{text}</span>
            </div>
            <div className={localClass.tail}></div>
          </div>
        </PortalDestination>
        {anchorElement}
      </React.Fragment>
    );
  })
);

Tooltip.displayName = componentName;

Tooltip.propTypes = {
  text: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
  className: PropTypes.string,
  dark: PropTypes.bool,
  open: PropTypes.bool,
  defaultOpen: PropTypes.bool,
  tailed: PropTypes.bool,
  style: PropTypes.object,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  placement: PropTypes.oneOf(allowedPlacements),
  triggersOn: PropTypes.oneOf(allowedTriggerEvents)
};

export default Tooltip;
