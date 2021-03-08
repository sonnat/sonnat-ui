import React, { useContext, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import FloatedListContext from "../context";
import makeStyles from "../../styles/makeStyles";

export const componentName = "MenuItem";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      mixins: { useDisableUserSelect },
      typography: { pxToRem, useText }
    } = theme;

    return {
      root: {
        ...useText({
          fontSize: pxToRem(14),
          color: colors.text.secondary
        }),
        ...useDisableUserSelect(),
        flexGrow: "1",
        flexShrink: "0",
        paddingRight: pxToRem(16),
        paddingLeft: pxToRem(16),
        display: "flex",
        alignItems: "center",
        minHeight: pxToRem(40),
        cursor: "pointer",
        transition: "color 240ms ease, background-color 240ms ease",
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 })
        },
        "&:active": {
          color: !darkMode ? colors.primary.origin : colors.primary.light,
          outline: "none"
        }
      },
      focused: {
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 }),
        outline: `1px solid ${colors.divider}`
      },
      disabled: {
        pointerEvents: "none",
        color: colors.text.disabled
      },
      hide: { display: "none" },
      dense: { fontSize: pxToRem(12), minHeight: pxToRem(32) }
    };
  },
  { name: `Sonnat${componentName}` }
);

const MenuItem = React.memo(function MenuItem(props) {
  const {
    className,
    children,
    onClick,
    onFocus,
    onBlur,
    // eslint-disable-next-line react/prop-types
    index,
    disabled = false,
    hide = false,
    ...otherProps
  } = props;

  const itemRef = useRef();

  const localClass = useStyles();

  const { registerNode, dense } = useContext(FloatedListContext);
  const [isMounted, setMounted] = useState(false);
  const [isFocused, setFocused] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (isMounted && itemRef.current && registerNode) {
    itemRef.current.disabled = disabled;
    itemRef.current.focused = isFocused;
    registerNode(index, itemRef.current);
  }

  return (
    <div
      aria-disabled={disabled}
      data-index={`${index}`}
      ref={itemRef}
      role="menuitem"
      tabIndex={disabled || !isFocused ? "-1" : "0"}
      onClick={e => {
        if (!disabled && onClick) onClick(e);
      }}
      onFocus={e => {
        if (!disabled) {
          if (onFocus) onFocus(e);
          setFocused(true);
        }
      }}
      onBlur={e => {
        if (!disabled) {
          if (onBlur) onBlur(e);
          setFocused(false);
        }
      }}
      className={createClass(localClass.root, className, {
        [localClass.focused]: isFocused,
        [localClass.disabled]: disabled,
        [localClass.hide]: hide,
        [localClass.dense]: dense
      })}
      {...otherProps}
    >
      {children}
    </div>
  );
});

MenuItem.displayName = componentName;

MenuItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  hide: PropTypes.bool
};

export default MenuItem;
