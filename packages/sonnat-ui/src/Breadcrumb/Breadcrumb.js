import React from "react";
import { isFragment } from "react-is";
import PropTypes from "prop-types";
import createClass from "classnames";
import { componentName as childName } from "./Item";
import makeStyles from "../styles/makeStyles";

const componentName = "Breadcrumb";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        height: pxToRem(24),
        overflow: "hidden"
      },
      list: {
        direction,
        fontFamily: fontFamily[direction],
        padding: "0",
        margin: "0",
        listStyle: "none",
        display: "flex",
        flexWrap: "nowrap",
        overflowX: "auto",
        overflowY: "hidden",
        width: "100%",
        position: "relative",
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch",
        "& > $item": {
          maxWidth: pxToRem(120)
        },
        "& > $item:last-child": {
          margin: 0,
          color: colors.text.hint,
          pointerEvents: "none",
          "&:after": {
            display: "none"
          }
        }
      },
      onlyPreviousStep: {
        "& > $item:not(:nth-last-child(2))": {
          display: "none"
        },
        "& > $item:nth-last-child(2)": {
          margin: 0,
          "&:hover:after": {
            color: colors.text.primary,
            transform: "rotate(180deg)"
          },
          "&:hover:after ~ $item:after": {
            transform: "rotate(0)"
          },
          "&:after": {
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

const Breadcrumb = React.memo(
  React.forwardRef(function Breadcrumb(props, ref) {
    const {
      className,
      // eslint-disable-next-line react/prop-types
      "aria-label": ariaLabel = "breadcrumb",
      children: childrenProp,
      showOnlyPreviousStep = false,
      ...otherProps
    } = props;

    const localClass = useStyles();

    const children = React.Children.map(childrenProp, child => {
      if (!React.isValidElement(child)) return null;

      if (isFragment(child)) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The Breadcrumb component doesn't accept a Fragment as a child."
        );

        return null;
      }

      if (child.type.displayName !== childName) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The Breadcrumb component only accepts `Breadcrumb/Item` as a child."
        );

        return null;
      }

      return React.cloneElement(child, {
        className: createClass(child.props.className, localClass.item)
      });
    });

    return (
      <nav
        aria-label={ariaLabel}
        className={createClass(localClass.root, className)}
        ref={ref}
        {...otherProps}
      >
        <ol
          className={createClass(localClass.list, {
            [localClass.onlyPreviousStep]: showOnlyPreviousStep
          })}
        >
          {children}
        </ol>
      </nav>
    );
  })
);

Breadcrumb.displayName = componentName;

Breadcrumb.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  showOnlyPreviousStep: PropTypes.bool
};

export default Breadcrumb;
