import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../../styles/makeStyles";

const componentName = "CardMedia";

const useStyles = makeStyles(
  {
    root: { width: "100%", position: "relative" }
  },
  { name: `Sonnat${componentName}` }
);

const CardMedia = React.forwardRef(function CardMedia(props, ref) {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();

  return (
    <div ref={ref} className={clx(classes.root, className)} {...otherProps}>
      {children}
    </div>
  );
});

CardMedia.displayName = componentName;

CardMedia.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CardMedia;
