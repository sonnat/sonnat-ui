import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../styles/makeStyles";
import useFormControl from "../FormControl/useFormControl";

const componentName = "FormControlLabel";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.useText({
        fontWeight: theme.typography.fontWeight.medium,
        color: theme.colors.text.primary
      }),
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction]
    },
    requiredIndicator: {
      color: theme.darkMode
        ? theme.colors.error.origin
        : theme.colors.error.light,
      ...(theme.direction === "rtl"
        ? { marginRight: theme.typography.pxToRem(4) }
        : { marginLeft: theme.typography.pxToRem(4) })
    },
    disabled: {}
  }),
  { name: `Sonnat${componentName}` }
);

const FormControlLabel = function FormControlLabel(props) {
  const {
    children,
    className,
    disabled = false,
    required = false,
    ...otherProps
  } = props;

  const classes = useStyles();
  const formControl = useFormControl();

  const controlProps = {
    disabled: formControl ? formControl.disabled : disabled,
    required: formControl ? formControl.required : required
  };

  return (
    <label
      className={clx(classes.root, className, {
        [classes.disabled]: controlProps.disabled
      })}
      {...otherProps}
    >
      {children}
      {controlProps.required && (
        <span className={classes.requiredIndicator}>*</span>
      )}
    </label>
  );
};

FormControlLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool
};

FormControlLabel.displayName = componentName;

export default FormControlLabel;
