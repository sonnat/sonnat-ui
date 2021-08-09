import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../styles/makeStyles";

export const componentName = "Card";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        borderRadius: pxToRem(4),
        backgroundColor: !darkMode
          ? colors.background.origin
          : colors.background.level[1],
        boxShadow: [
          "0 0 4px 0 rgba(0, 0, 0, 0.04)",
          "0 4px 12px 0 rgba(0, 0, 0, 0.04)",
          "0 2px 8px 0 rgba(0, 0, 0, 0.08)"
        ].join(", ")
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Card = React.memo(
  React.forwardRef(function Card(props, ref) {
    const { className, children, ...otherProps } = props;

    const classes = useStyles();

    return (
      <div ref={ref} className={clx(classes.root, className)} {...otherProps}>
        {children}
      </div>
    );
  })
);

Card.displayName = componentName;

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Card;
