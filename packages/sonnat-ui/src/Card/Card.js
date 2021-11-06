import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "../styles/makeStyles";
import getVar from "../utils/getVar";

const componentName = "Card";

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
          : colors.background.level[1]
      },
      outlined: { border: `1px solid ${colors.divider}` },
      elevated: {
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

const allowedVariants = ["outlined", "elevated"];

const Card = React.forwardRef(function Card(props, ref) {
  const {
    className,
    children,
    variant: variantProp = "elevated",
    ...otherProps
  } = props;

  const classes = useStyles();

  const variant = getVar(
    variantProp,
    "elevated",
    !allowedVariants.includes(variantProp)
  );

  return (
    <div
      ref={ref}
      className={clx(classes.root, className, classes[variant])}
      {...otherProps}
    >
      {children}
    </div>
  );
});

Card.displayName = componentName;

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(allowedVariants)
};

export default Card;
