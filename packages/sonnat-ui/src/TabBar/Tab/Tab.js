import React, { useContext } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import Icon from "../../Icon";
import makeStyles from "../../styles/makeStyles";
import { changeColor } from "../../styles/colorUtils";
import TabBarContext from "../context";

const componentName = "Tab";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useFontIconSize },
      typography: { pxToRem, useText }
    } = theme;

    return {
      root: {
        outline: "none",
        display: "flex",
        minHeight: pxToRem(48),
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        padding: [[0, pxToRem(24)]],
        WebkitAppearance: "none",
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
        }
      },
      content: {
        flex: [[1, 0]],
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        textAlign: "center",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        "& > $icon:only-child": useFontIconSize(24)
      },
      label: {
        ...useText({ color: colors.text.secondary }),
        transition: "color 360ms ease",
        ...(direction === "rtl"
          ? { marginRight: pxToRem(8) }
          : { marginLeft: pxToRem(8) })
      },
      icon: {
        ...useFontIconSize(20),
        color: colors.text.secondary,
        transition: "color 360ms ease"
      },
      fluid: {
        "& $content": {
          justifyContent: "center"
        }
      },
      stable: {
        minWidth: 0,
        opacity: "1",
        transition:
          "background-color 250ms ease, transform 250ms cubic-bezier(0.4, 0, 0.2, 1), opacity 0s",
        flex: [[1, 1, "auto"]]
      },
      dense: {
        "& $label": {
          fontSize: pxToRem(14),
          fontWeight: 500,
          ...(direction === "rtl"
            ? { marginRight: pxToRem(4) }
            : { marginLeft: pxToRem(4) })
        },
        "& $content > $icon:not(:only-child)": useFontIconSize(18)
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
      leadingIconed: { padding: [[0, pxToRem(16)]] },
      iconTab: {
        "& $content": { justifyContent: "center" }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Tab = React.memo(
  React.forwardRef(function Tab(props, ref) {
    const {
      className,
      label,
      icon,
      onClick,
      active,
      identifier,
      ...otherProps
    } = props;

    const localClass = useStyles();

    const hasLeadingIcon = icon != null && icon;
    const isIconTab = label == null || label.length === 0;

    const { dense, onChange, scrollable, fluid } = useContext(TabBarContext);

    return (
      <div
        role="tab"
        ref={ref}
        aria-selected={active}
        tabIndex={active ? 0 : -1}
        onClick={e => {
          if (!active) {
            if (onChange) onChange(e, identifier);
            if (onClick) onClick(e, identifier);
          }
        }}
        className={createClass(localClass.root, className, {
          [localClass.active]: active,
          [localClass.dense]: dense,
          [localClass.fluid]: fluid,
          [localClass.stable]: !scrollable,
          [localClass.leadingIconed]: hasLeadingIcon,
          [localClass.iconTab]: isIconTab
        })}
        {...otherProps}
      >
        <div className={localClass.content}>
          {icon && <Icon identifier={icon} className={localClass.icon} />}
          {label && <span className={localClass.label}>{label}</span>}
        </div>
      </div>
    );
  })
);

Tab.displayName = componentName;

Tab.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Tab;