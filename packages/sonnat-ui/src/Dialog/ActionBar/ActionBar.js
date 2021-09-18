import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import setRef from "../../utils/setRef";
import makeStyles from "../../styles/makeStyles";
import DialogContext from "../context";

const componentName = "DialogActionBar";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: pxToRem(16),
        "& > * + *": {
          ...{
            ltr: { marginLeft: pxToRem(8) },
            rtl: { marginRight: pxToRem(8) }
          }[direction]
        }
      },
      withOverflow: {
        padding: [[pxToRem(12), pxToRem(16)]],
        boxShadow: "0 -1px 2px 0 rgba(0, 0, 0, 0.12)"
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const DialogActionBar = React.forwardRef(function DialogActionBar(props, ref) {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();
  const { hasOverflow, registerActionBar } = React.useContext(DialogContext);

  return (
    <div
      ref={node => {
        if (ref) setRef(ref, node);
        registerActionBar(node);
      }}
      className={clx(classes.root, className, {
        [classes.withOverflow]: hasOverflow
      })}
      {...otherProps}
    >
      {children}
    </div>
  );
});

DialogActionBar.displayName = componentName;

DialogActionBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default DialogActionBar;
