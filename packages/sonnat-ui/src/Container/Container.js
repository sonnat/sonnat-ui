import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
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
        paddingRight: pxToRem(gutter),
        paddingLeft: pxToRem(gutter),
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
      noPadding: {
        paddingRight: 0,
        paddingLeft: 0
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
    const {
      children,
      className,
      fluid = false,
      noPadding = false,
      ...otherProps
    } = props;

    const classes = useStyles();

    return (
      <div
        ref={ref}
        className={clx(
          classes.root,
          typeof fluid === "boolean"
            ? { [classes.fluid]: fluid }
            : classes[`${fluid}Fluid`],
          className,
          { [classes.noPadding]: noPadding }
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
  noPadding: PropTypes.bool,
  fluid: PropTypes.oneOfType([PropTypes.bool, PropTypes.oneOf(breakpointEnum)])
};

export default Container;
