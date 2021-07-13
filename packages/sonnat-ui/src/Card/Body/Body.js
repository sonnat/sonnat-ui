import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../../styles/makeStyles";

const componentName = "CardBody";

const useStyles = makeStyles(
  theme => {
    const {
      typography: { pxToRem }
    } = theme;

    return {
      root: { padding: pxToRem(16) }
    };
  },
  { name: `Sonnat${componentName}` }
);

const CardBody = React.memo(
  React.forwardRef(function CardBody(props, ref) {
    const { className, children, ...otherProps } = props;

    const classes = useStyles();

    return (
      <div ref={ref} className={clx(classes.root, className)} {...otherProps}>
        {children}
      </div>
    );
  })
);

CardBody.displayName = componentName;

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CardBody;
