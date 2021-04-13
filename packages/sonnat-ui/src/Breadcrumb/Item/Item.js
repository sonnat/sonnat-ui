import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../../styles/makeStyles";

export const componentName = "BreadcrumbItem";

const useStyles = makeStyles(
  theme => {
    const {
      icons,
      colors,
      direction,
      typography: { pxToRem, useText },
      mixins: { useFontIcon }
    } = theme;

    return {
      root: {
        ...useText({
          fontSize: pxToRem(12),
          color: colors.text.secondary
        }),
        display: "inline-flex",
        alignItems: "center",
        flexShrink: "0",
        cursor: "pointer",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        transition: "color 360ms ease",
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) }),
        "& > a": { textDecoration: "none", color: "inherit" },
        "&:hover": {
          color: colors.text.primary,
          "&:after": {
            color: colors.text.primary,
            transform: "rotate(180deg)"
          },
          "& ~ $root:after": {
            transform: "rotate(180deg)"
          }
        },
        "&:after": {
          ...useFontIcon(),
          width: pxToRem(16),
          height: pxToRem(16),
          fontSize: pxToRem(16),
          display: "block",
          color: colors.text.secondary,
          flexShrink: "0",
          transition: "color 360ms ease, transform 360ms ease",
          ...(direction === "rtl"
            ? { content: icons.variable.chevronLeft }
            : { content: icons.variable.chevronRight })
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const BreadcrumbItem = React.memo(
  React.forwardRef(function BreadcrumbItem(props, ref) {
    const { className, children, ...otherProps } = props;

    const localClass = useStyles();

    return (
      <li
        ref={ref}
        className={createClass(localClass.root, className)}
        {...otherProps}
      >
        {children}
      </li>
    );
  })
);

BreadcrumbItem.displayName = componentName;

BreadcrumbItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default BreadcrumbItem;
