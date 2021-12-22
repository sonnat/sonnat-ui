import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import useFormControl from "../useFormControl";
import useStyles from "./styles";

interface FormControlFeedbackBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the feedback will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
}

export type FormControlFeedbackProps = MergeElementProps<
  "div",
  FormControlFeedbackBaseProps
>;

type Component = {
  (props: FormControlFeedbackProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<FormControlFeedbackProps> | undefined;
  displayName?: string | undefined;
};

const FormControlFeedbackBase = (
  props: FormControlFeedbackProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { children, className, hasError, ...otherProps } = props;

  const classes = useStyles();
  const formControl = useFormControl();

  const controlProps = {
    hasError: formControl ? formControl.hasError : hasError
  };

  return (
    <div
      ref={ref}
      className={c(classes.root, className, {
        [classes.errored]: controlProps.hasError
      })}
      {...otherProps}
    >
      {children}
    </div>
  );
};

const FormControlFeedback = React.forwardRef(
  FormControlFeedbackBase
) as Component;

FormControlFeedback.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  hasError: PropTypes.bool
};

export default FormControlFeedback;
