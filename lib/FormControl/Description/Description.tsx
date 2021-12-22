import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import useFormControl from "../useFormControl";
import useStyles from "./styles";

interface FormControlDescriptionBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the description will appear as disabled.
   * @default false
   */
  disabled?: boolean;
}

export type FormControlDescriptionProps = MergeElementProps<
  "p",
  FormControlDescriptionBaseProps
>;

type Component = {
  (props: FormControlDescriptionProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<FormControlDescriptionProps> | undefined;
  displayName?: string | undefined;
};

const FormControlDescriptionBase = (
  props: FormControlDescriptionProps,
  ref: React.Ref<HTMLParagraphElement>
) => {
  const { children, className, disabled = false, ...otherProps } = props;

  const classes = useStyles();
  const formControl = useFormControl();

  const controlProps = {
    disabled: formControl ? formControl.disabled : disabled
  };

  return (
    <p
      ref={ref}
      className={c(classes.root, className, {
        [classes.disabled]: controlProps.disabled
      })}
      {...otherProps}
    >
      {children}
    </p>
  );
};

const FormControlDescription = React.forwardRef(
  FormControlDescriptionBase
) as Component;

FormControlDescription.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

export default FormControlDescription;
