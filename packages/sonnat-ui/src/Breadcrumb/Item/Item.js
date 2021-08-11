import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import { ChevronLeft, ChevronRight } from "../../internals/icons";
import makeStyles from "../../styles/makeStyles";
import useTheme from "../../styles/useTheme";

const componentName = "BreadcrumbItem";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      mixins: { useIconWrapper },
      hacks: { backfaceVisibilityFix },
      typography: { pxToRem, useText }
    } = theme;

    return {
      root: {
        ...useText({
          fontSize: pxToRem(12),
          color: colors.text.secondary,
          lineHeight: 1.6666666667
        }),
        maxWidth: pxToRem(120),
        display: "inline-flex",
        alignItems: "center",
        flexShrink: "0",
        cursor: "pointer",
        transition: "color 360ms ease",
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) }),
        "& > a": { textDecoration: "none", color: "inherit" },
        "&:hover": {
          color: colors.text.primary,
          "& > $separator": {
            color: colors.text.primary,
            transform: "rotate(180deg)"
          },
          "& ~ $root > $separator": { transform: "rotate(180deg)" }
        }
      },
      content: {
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden"
      },
      separator: {
        ...useIconWrapper(16),
        ...backfaceVisibilityFix,
        color: colors.text.secondary,
        flexShrink: "0",
        transition: "color 360ms ease, transform 360ms ease"
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const BreadcrumbItem = React.memo(
  React.forwardRef(function BreadcrumbItem(props, ref) {
    const { className, children, ...otherProps } = props;

    const classes = useStyles();
    const theme = useTheme();

    const isRtl = theme.direction === "rtl";

    return (
      <li ref={ref} className={clx(classes.root, className)} {...otherProps}>
        <div className={classes.content}>{children}</div>
        <i role="separator" className={classes.separator}>
          {isRtl ? <ChevronLeft /> : <ChevronRight />}
        </i>
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
