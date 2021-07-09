import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";
import useFormControl from "../FormControl/useFormControl";

const componentName = "FormControlDescription";

const useStyles = makeStyles(
  theme => ({
    root: {
      ...theme.typography.useText({
        fontSize: theme.typography.pxToRem(14),
        lineHeight: 1.5714285714,
        color: theme.colors.text.secondary
      }),
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction]
    },
    disabled: {}
  }),
  { name: `Sonnat${componentName}` }
);

const FormControlDescription = function FormControlDescription(props) {
  const { children, className, disabled = false, ...otherProps } = props;

  const localClass = useStyles();
  const formControl = useFormControl();

  const controlProps = {
    disabled: formControl ? formControl.disabled : disabled
  };

  return (
    <p
      className={createClass(localClass.root, className, {
        [localClass.disabled]: controlProps.disabled
      })}
      {...otherProps}
    >
      {children}
    </p>
  );
};

FormControlDescription.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

FormControlDescription.displayName = componentName;

export default FormControlDescription;
