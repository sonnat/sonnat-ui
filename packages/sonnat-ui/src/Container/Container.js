import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import { breakpointEnum } from "../utils/enums";
import makeStyles from "../styles/makeStyles";

const componentName = "Container";

const useStyles = makeStyles(
  theme => {
    const {
      breakpoints,
      direction,
      spacings: { gutter },
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        width: "100%",
        paddingRight: `${pxToRem(gutter)}`,
        paddingLeft: `${pxToRem(gutter)}`,
        marginRight: "auto",
        marginLeft: "auto",
        [breakpoints.up("xxs")]: {
          maxWidth: "100%",
          "&$xxsFluid": { extend: "fluid" }
        },
        [breakpoints.up("xs")]: {
          "&$xsFluid": { extend: "fluid" }
        },
        [breakpoints.up("sm")]: {
          maxWidth: breakpoints.values["sm"],
          "&$smFluid": { extend: "fluid" }
        },
        [breakpoints.up("md")]: {
          "&$mdFluid": { extend: "fluid" }
        },
        [breakpoints.up("lg")]: {
          maxWidth: breakpoints.values["md"],
          "&$lgFluid": { extend: "fluid" }
        },
        [breakpoints.up("xlg")]: {
          maxWidth: 1184,
          "&$xlgFluid": { extend: "fluid" }
        }
      },
      fluid: {
        maxWidth: "100%"
      },
      xxsFluid: {},
      xsFluid: {},
      smFluid: {},
      mdFluid: {},
      lgFluid: {},
      xlgFluid: {}
    };
  },
  { name: `Sonnat${componentName}` }
);

const Container = React.memo(
  React.forwardRef(function Container(props, ref) {
    const { children, className, fluid = false, ...otherProps } = props;

    const localClass = useStyles();

    return (
      <div
        ref={ref}
        className={createClass(
          localClass.root,
          typeof fluid === "boolean"
            ? { [localClass.fluid]: fluid }
            : localClass[`${fluid}Fluid`],
          className
        )}
        {...otherProps}
      >
        {children}
      </div>
    );
  })
);

Container.displayName = componentName;

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  fluid: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(breakpointEnum)])
};

export default Container;
