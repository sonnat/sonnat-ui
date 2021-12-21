import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import useFormControl from "../useFormControl";
import useStyles from "./styles";

interface FormControlBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the label will appear as disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the label will indicate required input.
   * @default false
   */
  required?: boolean;
}

export type FormControlProps = MergeElementProps<"label", FormControlBaseProps>;

type Component = {
  (props: FormControlProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<FormControlProps> | undefined;
  displayName?: string | undefined;
};

const FormControlLabelBase = (
  props: FormControlProps,
  ref: React.Ref<HTMLLabelElement>
) => {
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
      ref={ref}
      className={c(classes.root, className, {
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

const FormControlLabel = React.forwardRef(FormControlLabelBase) as Component;

FormControlLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool
};

export default FormControlLabel;
