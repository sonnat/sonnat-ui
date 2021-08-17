import clx from "classnames";
import PropTypes from "prop-types";
import React, { useState } from "react";
import makeStyles from "../styles/makeStyles";
import useIsMounted from "../utils/useIsMounted";
import FormControlContext from "./context";

const componentName = "FormControl";

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
      focused = false,
      disabled = false,
      hasError = false,
      fluid = false,
      required = false,
      ...otherProps
    } = props;

    const classes = useStyles();

    const isMounted = useIsMounted();

    const [isFocused, setFocused] = useState(focused);

    const childrenContext = React.useMemo(
      () => ({
        fluid,
        disabled,
        hasError,
        required,
        focusedState: disabled ? false : isFocused,
        onFocus: () => {
          if (isMounted()) setFocused(true);
        },
        onBlur: () => {
          if (isMounted()) setFocused(false);
        }
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [fluid, disabled, hasError, required, isFocused]
    );

    return (
      <FormControlContext.Provider value={childrenContext}>
        <div
          ref={ref}
          className={clx(classes.root, className, {
            [classes.fluid]: fluid
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
  required: PropTypes.bool
};

FormControl.displayName = componentName;

export default FormControl;
