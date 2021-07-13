import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "../../styles/makeStyles";
import setRef from "../../utils/setRef";
import DialogContext from "../context";

const componentName = "DialogBody";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      typography: { pxToRem }
    } = theme;

    return {
      root: { padding: pxToRem(16) },
      withOverflow: {
        overflowX: "hidden",
        overflowY: "scroll",
        backgroundColor: !darkMode ? "inherit" : colors.background.level[2]
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const DialogBody = React.memo(
  React.forwardRef(function DialogBody(props, ref) {
    const { className, children, style = {}, ...otherProps } = props;

    const { height: heightStyle, ...styles } = style;

    const classes = useStyles();
    const { hasOverflow, bodyHeight, registerBody } =
      React.useContext(DialogContext);

    const height = bodyHeight || heightStyle || "auto";

    return (
      <div
        ref={node => {
          if (ref) setRef(ref, node);
          registerBody(node);
        }}
        style={{ ...styles, height }}
        className={clx(classes.root, className, {
          [classes.withOverflow]: hasOverflow
        })}
        {...otherProps}
      >
        {children}
      </div>
    );
  })
);

DialogBody.displayName = componentName;

DialogBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object
};

export default DialogBody;
