import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";
import FormControlContext from "./context";

const componentName = "FormControl";

const allowedSizes = ["small", "medium"];

const useStyles = makeStyles(
  theme => ({
    root: {
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      display: "inline-flex",
      flexDirection: "column",
      position: "relative",
      verticalAlign: "top",
      alignItems: "flex-start"
    },
    fluid: { width: "100%" }
  }),
  { name: `Sonnat${componentName}` }
);

const FormControl = React.memo(
  React.forwardRef(function FormControl(props, ref) {
    const {
      children,
      className,
      size = "medium",
      focused = false,
      disabled = false,
      hasError = false,
      fluid = false,
      required = false,
      ...otherProps
    } = props;

    const localClass = useStyles();

    const [isFocused, setFocused] = useState(focused);
    const [isMounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
      return () => {
        setMounted(false);
      };
    }, []);

    const childrenContext = {
      fluid,
      size,
      disabled,
      hasError,
      required,
      focusedState: disabled ? false : isFocused,
      onFocus: () => {
        if (isMounted) setFocused(true);
      },
      onBlur: () => {
        if (isMounted) setFocused(false);
      }
    };

    return (
      <FormControlContext.Provider value={childrenContext}>
        <div
          ref={ref}
          className={createClass(localClass.root, className, {
            [localClass.fluid]: fluid
          })}
          {...otherProps}
        >
          {children}
        </div>
      </FormControlContext.Provider>
    );
  })
);

FormControl.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  focused: PropTypes.bool,
  fluid: PropTypes.bool,
  required: PropTypes.bool,
  size: PropTypes.oneOf(allowedSizes)
};

FormControl.displayName = componentName;

export default FormControl;
