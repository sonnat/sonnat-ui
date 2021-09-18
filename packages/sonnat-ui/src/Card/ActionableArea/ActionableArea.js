import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "../../styles/makeStyles";
import { blue } from "../../styles/pallete";
import useEventCallback from "../../utils/useEventCallback";
import useForkRef from "../../utils/useForkRef";
import useIsFocusVisible from "../../utils/useIsFocusVisible";

const componentName = "CardActionableArea";

const useStyles = makeStyles(
  theme => ({
    root: {
      position: "relative",
      width: "100%",
      cursor: "pointer",
      "&:after": {
        content: '""',
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0,
        backgroundColor: "currentcolor",
        transition: "opacity 180ms ease"
      },
      "&:hover:after": {
        opacity: 0.04,
        "@media (hover: none)": { opacity: 0 }
      },
      "&:active:after": {
        opacity: 0.08
      }
    },
    focusVisible: {
      outline: `2px solid ${theme.darkMode ? blue[300] : blue[500]}`,
      outlineOffset: 1
    }
  }),
  { name: `Sonnat${componentName}` }
);

const CardActionableArea = React.forwardRef(function CardActionableArea(
  props,
  ref
) {
  const {
    className,
    children,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClick,
    ...otherProps
  } = props;

  const classes = useStyles();

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const actionRef = React.useRef(null);

  const handleOwnRef = useForkRef(focusVisibleRef, actionRef);
  const handleRef = useForkRef(ref, handleOwnRef);

  const [focusVisible, setFocusVisible] = React.useState(false);

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusVisible]);

  const handleFocus = useEventCallback(event => {
    // Fix for https://github.com/facebook/react/issues/7769
    if (!actionRef.current) actionRef.current = event.currentTarget;

    handleFocusVisible(event);

    if (isFocusVisibleRef.current === true) setFocusVisible(true);
    if (onFocus) onFocus(event);
  });

  const handleBlur = useEventCallback(event => {
    handleBlurVisible(event);

    if (isFocusVisibleRef.current === false) setFocusVisible(false);
    if (onBlur) onBlur(event);
  });

  const keyDownRef = React.useRef(false);

  const handleKeyDown = useEventCallback(event => {
    if (keyDownRef.current === false && focusVisible && event.key === " ") {
      keyDownRef.current = true;
    }

    if (event.target === event.currentTarget && event.key === " ") {
      event.preventDefault();
    }

    if (onKeyDown) onKeyDown(event);

    // Keyboard accessibility for non interactive elements
    if (
      event.target === event.currentTarget &&
      event.key.toLowerCase() === "enter"
    ) {
      event.preventDefault();
      if (onClick) onClick(event);
    }
  });

  const handleKeyUp = useEventCallback(event => {
    if (!event.defaultPrevented && focusVisible && event.key === " ") {
      keyDownRef.current = false;
    }

    if (onKeyUp) onKeyUp(event);

    // Keyboard accessibility for non interactive elements
    if (
      event.target === event.currentTarget &&
      event.key === " " &&
      !event.defaultPrevented
    ) {
      if (onClick) onClick(event);
    }
  });

  return (
    <div
      role="button"
      tabIndex={0}
      ref={handleRef}
      className={clx(classes.root, className, {
        [classes.focusVisible]: focusVisible
      })}
      onClick={onClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      {...otherProps}
    >
      {children}
    </div>
  );
});

CardActionableArea.displayName = componentName;

CardActionableArea.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func
};

export default CardActionableArea;
