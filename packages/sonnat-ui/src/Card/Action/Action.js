import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import Button from "../../Button";
import makeStyles from "../../styles/makeStyles";

export const componentName = "CardAction";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        ...(direction === "rtl"
          ? { marginRight: pxToRem(8) }
          : { marginLeft: pxToRem(8) })
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const CardAction = React.memo(
  React.forwardRef(function CardAction(props, ref) {
    const { className, ...otherProps } = props;

    const localClass = useStyles();

    return (
      <Button
        ref={ref}
        className={createClass(localClass.root, className)}
        size="small"
        variant="inlined"
        {...otherProps}
      />
    );
  })
);

CardAction.displayName = componentName;

CardAction.propTypes = {
  className: PropTypes.string
};

export default CardAction;
