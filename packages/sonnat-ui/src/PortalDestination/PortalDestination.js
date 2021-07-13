import React from "react";
import PropTypes from "prop-types";
import Portal from "../Portal";
import makeStyles from "../styles/makeStyles";

const componentName = "PortalDestination";

const useStyles = makeStyles(
  {
    root: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%"
    }
  },
  { name: `Sonnat${componentName}` }
);

const PortalDestination = React.memo(
  React.forwardRef(function PortalDestination(props, ref) {
    const { children, ...otherProps } = props;

    const classes = useStyles();

    return (
      <Portal>
        <div
          ref={ref}
          className={classes.root}
          role="presentation"
          {...otherProps}
        >
          {children}
        </div>
      </Portal>
    );
  })
);

PortalDestination.displayName = componentName;

PortalDestination.propTypes = {
  children: PropTypes.node
};

export default PortalDestination;
