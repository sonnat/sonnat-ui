import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../../styles/makeStyles";

const componentName = "CardActionBar";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        display: "flex",
        alignItems: "center",
        padding: pxToRem(8),
        "& > * + *": {
          ...{
            ltr: { marginLeft: pxToRem(8) },
            rtl: { marginRight: pxToRem(8) }
          }[direction]
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const CardActionBar = React.forwardRef(function CardActionBar(props, ref) {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();

  return (
    <div ref={ref} className={clx(classes.root, className)} {...otherProps}>
      {children}
    </div>
  );
});

CardActionBar.displayName = componentName;

CardActionBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CardActionBar;
