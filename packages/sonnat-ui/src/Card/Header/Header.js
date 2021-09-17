import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../../styles/makeStyles";

const componentName = "CardHeader";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        display: "flex",
        padding: pxToRem(16),
        alignItems: "center"
      },
      body: {
        flex: [[1, 1, "auto"]]
      },
      action: {
        flex: [[0, 0, "auto"]],
        alignSelf: "flex-start",
        ...{
          ltr: { marginLeft: pxToRem(8) },
          rtl: { marginRight: pxToRem(8) }
        }[direction]
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const CardHeader = React.forwardRef(function CardHeader(props, ref) {
  const { className, children, action, ...otherProps } = props;

  const classes = useStyles();

  return (
    <div ref={ref} className={clx(classes.root, className)} {...otherProps}>
      <div className={classes.body}>{children}</div>
      {action && <div className={classes.action}>{action}</div>}
    </div>
  );
});

CardHeader.displayName = componentName;

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  action: PropTypes.node
};

export default CardHeader;
