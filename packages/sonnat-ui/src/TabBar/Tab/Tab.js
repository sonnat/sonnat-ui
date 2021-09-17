import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { changeColor } from "../../styles/colorUtils";
import makeStyles from "../../styles/makeStyles";
import { blue } from "../../styles/pallete";
import useEventCallback from "../../utils/useEventCallback";
import useForkRef from "../../utils/useForkRef";
import useIsFocusVisible from "../../utils/useIsFocusVisible";
import TabBarContext from "../context";

const componentName = "Tab";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useIconWrapper },
      typography: { pxToRem, useText }
    } = theme;

    return {
      root: {
        outline: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        appearance: "none !important",
        cursor: "pointer",
        transition: "250ms ease",
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 })
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 })
            : colors.createWhiteColor({ alpha: 0.08 })
        },
        "&:after": {
          content: "''",
          position: "absolute",
          width: "100%",
          height: `calc(100% - ${pxToRem(8)})`,
          border: `2px solid ${darkMode ? blue[300] : blue[500]}`,
          opacity: 0,
          visibility: "hidden"
        }
      },
      content: {
        flex: [[1, 0]],
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        textAlign: "center",
        overflow: "hidden",
        display: "flex",
        alignItems: "center"
      },
      label: {
        ...useText({ color: colors.text.secondary }),
        transition: "color 360ms ease"
      },
      icon: {
        ...useIconWrapper(20),
        color: colors.text.secondary,
        transition: "color 360ms ease",
        "& + $label": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(4) }
            : { marginLeft: pxToRem(4) })
        }
      },
      fluid: {
        "& $content": { justifyContent: "center" }
      },
      stable: {
        minWidth: 0,
        opacity: "1",
        transition:
          "background-color 250ms ease, transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 0s",
        flex: [[1, 1, "auto"]]
      },
      small: {
        minHeight: pxToRem(32),
        padding: [[0, pxToRem(16)]],
        "& $label": {
          fontSize: pxToRem(12),
          fontWeight: 500,
          lineHeight: 1.6666666667
        },
        "& $icon": useIconWrapper(14),
        "&$iconTab $icon": useIconWrapper(16),
        "&$leadingIconed": { padding: [[0, pxToRem(12)]] }
      },
      medium: {
        minHeight: pxToRem(40),
        padding: [[0, pxToRem(20)]],
        "& $label": {
          fontSize: pxToRem(14),
          fontWeight: 500,
          lineHeight: 1.5714285714
        },
        "& $icon": useIconWrapper(16),
        "&$iconTab $icon": useIconWrapper(18),
        "&$leadingIconed": { padding: [[0, pxToRem(12)]] }
      },
      large: {
        minHeight: pxToRem(48),
        padding: [[0, pxToRem(24)]],
        "& $icon": {
          ...useIconWrapper(20),
          "& + $label": {
            ...(direction === "rtl"
              ? { marginRight: pxToRem(8) }
              : { marginLeft: pxToRem(8) })
          }
        },
        "&$iconTab $icon": useIconWrapper(24),
        "&$leadingIconed": { padding: [[0, pxToRem(16)]] }
      },
      active: {
        "& $label": {
          color: !darkMode ? colors.primary.origin : colors.primary.light
        },
        "& $icon": {
          color: !darkMode ? colors.primary.origin : colors.primary.light
        },
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.04 })
            : changeColor(colors.primary.light, { alpha: 0.04 })
        },
        "&:active": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.08 })
            : changeColor(colors.primary.light, { alpha: 0.08 })
        }
      },
      leadingIconed: {},
      iconTab: { "& $content": { justifyContent: "center" } },
      focusVisible: {
        "&:after": {
          opacity: 1,
          visibility: "visible"
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Tab = React.forwardRef(function Tab(props, ref) {
  const {
    className,
    label,
    icon,
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    active,
    identifier,
    ...otherProps
  } = props;

  const classes = useStyles();

  const hasLeadingIcon = icon != null && icon;
  const isIconTab = label == null || label.length === 0;

  const {
    size,
    onChange,
    scrollable,
    fluid,
    focusLeftAdjacentTab,
    focusRightAdjacentTab
  } = React.useContext(TabBarContext);

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const tabRef = React.useRef(null);

  const handleOwnRef = useForkRef(focusVisibleRef, tabRef);
  const handleRef = useForkRef(ref, handleOwnRef);

  const [focusVisible, setFocusVisible] = React.useState(false);

  if (!active && focusVisible) {
    setFocusVisible(false);
  }

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusVisible]);

  const handleFocus = useEventCallback(event => {
    // Fix for https://github.com/facebook/react/issues/7769
    if (!tabRef.current) tabRef.current = event.currentTarget;

    handleFocusVisible(event);

    if (isFocusVisibleRef.current === true) setFocusVisible(true);
    if (onFocus) onFocus(event);
  });

  const handleBlur = useEventCallback(event => {
    handleBlurVisible(event);

    if (isFocusVisibleRef.current === false) setFocusVisible(false);
    if (onBlur) onBlur(event);
  });

  const handleKeyDown = useEventCallback(event => {
    if (onKeyDown) onKeyDown(event);

    if (
      event.target === event.currentTarget &&
      (event.key === "Left" || event.key === "ArrowLeft") &&
      active
    ) {
      event.preventDefault();
      focusLeftAdjacentTab(identifier);
    }

    if (
      event.target === event.currentTarget &&
      (event.key === "Right" || event.key === "ArrowRight") &&
      active
    ) {
      event.preventDefault();
      focusRightAdjacentTab(identifier);
    }
  });

  return (
    <div
      role="tab"
      ref={handleRef}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={e => {
        if (!active) {
          if (onChange) onChange(e, identifier);
          if (onClick) onClick(e, identifier);
        }
      }}
      className={clx(classes.root, className, classes[size], {
        [classes.active]: active,
        [classes.fluid]: fluid,
        [classes.stable]: !scrollable,
        [classes.leadingIconed]: hasLeadingIcon,
        [classes.iconTab]: isIconTab,
        [classes.focusVisible]: focusVisible
      })}
      {...otherProps}
    >
      <div className={classes.content}>
        {icon && <i className={classes.icon}>{icon}</i>}
        {label && <span className={classes.label}>{label}</span>}
      </div>
    </div>
  );
});

Tab.displayName = componentName;

Tab.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.node,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Tab;
