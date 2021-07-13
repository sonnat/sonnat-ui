import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../styles/makeStyles";

const componentName = "Row";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      spacings: { gutter },
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "flex",
        flexWrap: "wrap",
        marginRight: pxToRem(-gutter / 2),
        marginLeft: pxToRem(-gutter / 2)
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Row = React.memo(
  React.forwardRef(function Row(props, ref) {
    const { children, className, ...otherProps } = props;

    const classes = useStyles();

    return (
      <div ref={ref} className={clx(classes.root, className)} {...otherProps}>
        {children}
      </div>
    );
  })
);

Row.displayName = componentName;

Row.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default Row;
