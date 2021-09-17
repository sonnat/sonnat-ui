import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { isFragment } from "react-is";
import makeStyles from "../styles/makeStyles";
import Item from "./Item";

const componentName = "Breadcrumb";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: { overflow: "hidden" },
      list: {
        direction,
        fontFamily: fontFamily[direction],
        padding: "0",
        margin: "0",
        listStyle: "none",
        display: "flex",
        height: pxToRem(24),
        flexWrap: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        width: "100%",
        position: "relative",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
        "& > $item:last-child": {
          margin: 0,
          color: colors.text.hint,
          pointerEvents: "none",
          "& > [role='separator']": { display: "none" }
        }
      },
      onlyPreviousStep: {
        "& > $item:not(:nth-last-child(2))": { display: "none" },
        "& > $item:nth-last-child(2)": {
          margin: 0,
          "&:hover": {
            "& > [role='separator']": {
              color: colors.text.primary,
              transform: "rotate(180deg)"
            },
            "& ~ $item > [role='separator']": { transform: "rotate(0)" }
          },
          "& > [role='separator']": {
            order: "-1",
            transform: "rotate(180deg)",
            ...(direction === "rtl"
              ? { marginLeft: pxToRem(4) }
              : { marginRight: pxToRem(4) })
          }
        }
      },
      item: {}
    };
  },
  { name: `Sonnat${componentName}` }
);

const Breadcrumb = React.forwardRef(function Breadcrumb(props, ref) {
  const {
    className,
    // eslint-disable-next-line react/prop-types
    "aria-label": ariaLabel = "breadcrumb",
    children: childrenProp,
    showOnlyPreviousStep = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) return null;

    if (isFragment(child)) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Breadcrumb component doesn't accept a Fragment as a child."
      );
    }

    if (child.type !== Item) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Breadcrumb component only accepts `Breadcrumb/Item` as a child."
      );
    }

    return React.cloneElement(child, {
      className: clx(child.props.className, classes.item)
    });
  });

  return (
    <nav
      aria-label={ariaLabel}
      className={clx(classes.root, className)}
      ref={ref}
      {...otherProps}
    >
      <ol
        className={clx(classes.list, {
          [classes.onlyPreviousStep]: showOnlyPreviousStep
        })}
      >
        {children}
      </ol>
    </nav>
  );
});

Breadcrumb.displayName = componentName;

Breadcrumb.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  showOnlyPreviousStep: PropTypes.bool
};

export default Breadcrumb;
