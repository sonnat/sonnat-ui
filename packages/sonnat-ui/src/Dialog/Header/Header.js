import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "../../styles/makeStyles";
import Text from "../../Text";
import setRef from "../../utils/setRef";
import DialogContext from "../context";

const componentName = "DialogHeader";

const useStyles = makeStyles(
  theme => {
    const {
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        position: "relative",
        flex: [[1, 1, "auto"]],
        display: "flex",
        padding: pxToRem(16),
        alignItems: "center"
      },
      withOverflow: {
        boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.12)"
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const DialogHeader = React.forwardRef(function DialogHeader(props, ref) {
  const { className, children, title, ...otherProps } = props;

  const classes = useStyles();

  const { id, hasOverflow, registerHeader } = React.useContext(DialogContext);

  return (
    <div
      ref={node => {
        if (ref) setRef(ref, node);
        registerHeader(node);
      }}
      className={clx(classes.root, className, {
        [classes.withOverflow]: hasOverflow
      })}
      {...otherProps}
    >
      <Text id={id} variant="subtitle">
        {title}
      </Text>
      {children}
    </div>
  );
});

DialogHeader.displayName = componentName;

DialogHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default DialogHeader;
