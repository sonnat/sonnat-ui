import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import Icon from "../Icon";
import makeStyles from "../styles/makeStyles";

const componentName = "Tag";
const allowedVariants = ["filled", "outlined"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useFontIconSize },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    return {
      root: {
        ...useText({
          fontSize: pxToRem(14),
          color: colors.text.secondary
        }),
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        alignItems: "center",
        verticalAlign: "middle",
        height: pxToRem(30),
        borderRadius: pxToRem(2),
        paddingRight: pxToRem(8),
        paddingLeft: pxToRem(8),
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.04 })
          : colors.createWhiteColor({ alpha: 0.04 })
      },
      icon: {
        ...useFontIconSize(16),
        ...(direction === "rtl"
          ? { marginRight: pxToRem(-4), marginLeft: pxToRem(4) }
          : { marginLeft: pxToRem(-4), marginRight: pxToRem(4) }),
        color: colors.text.secondary
      },
      outlined: {
        border: `${pxToRem(1)} solid ${colors.divider}`,
        backgroundColor: colors.transparent
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Tag = React.memo(
  React.forwardRef(function Tag(props, ref) {
    const { icon, label, variant = "filled", className, ...otherProps } = props;

    const localClass = useStyles();

    return (
      <div
        ref={ref}
        className={createClass(localClass.root, className, {
          [localClass[variant]]: allowedVariants.includes(variant)
        })}
        {...otherProps}
      >
        {icon && <Icon identifier={icon} className={localClass.icon} />}
        {label}
      </div>
    );
  })
);

Tag.displayName = componentName;

Tag.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(allowedVariants),
  className: PropTypes.string
};

export default Tag;
