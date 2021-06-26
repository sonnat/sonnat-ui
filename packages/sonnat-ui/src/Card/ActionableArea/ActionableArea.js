import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../../styles/makeStyles";

const componentName = "CardActionableArea";

const useStyles = makeStyles(
  {
    root: {
      position: "relative",
      width: "100%",
      cursor: "pointer",
      "&:after": {
        content: '""',
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        opacity: 0,
        backgroundColor: "currentcolor",
        transition: "opacity 180ms ease"
      },
      "&:hover:after": {
        opacity: 0.04,
        "@media (hover: none)": { opacity: 0 }
      },
      "&:active:after": {
        opacity: 0.08
      }
    }
  },
  { name: `Sonnat${componentName}` }
);

const CardActionableArea = React.memo(
  React.forwardRef(function CardActionableArea(props, ref) {
    const { className, children, onClick, ...otherProps } = props;

    const classes = useStyles();

    return (
      <div
        role="button"
        tabIndex={0}
        ref={ref}
        className={createClass(classes.root, className)}
        onClick={onClick}
        {...otherProps}
      >
        {children}
      </div>
    );
  })
);

CardActionableArea.displayName = componentName;

CardActionableArea.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func
};

export default CardActionableArea;
