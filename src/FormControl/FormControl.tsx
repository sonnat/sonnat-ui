import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import useIsMounted from "../utils/useIsMounted";
import FormControlContext from "./context";
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
   * If `true`, the form controller will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the form controller will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the form controller will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * If `true`, the form controller will be fluid (max-width: 100%).
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the form controller will be focused.
   * @default false
   */
  focused?: boolean;
}

export type FormControlProps = MergeElementProps<"div", FormControlBaseProps>;

type Component = {
  (props: FormControlProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<FormControlProps> | undefined;
  displayName?: string | undefined;
};

const FormControlBase = (
  props: FormControlProps,
  ref: React.Ref<HTMLDivElement>
) => {
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

  const [isFocused, setFocused] = React.useState(focused);

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
        className={c(classes.root, className, {
          [classes.fluid]: fluid
        })}
        {...otherProps}
      >
        {children}
      </div>
    </FormControlContext.Provider>
  );
};

const FormControl = React.forwardRef(FormControlBase) as Component;

FormControl.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  hasError: PropTypes.bool,
  focused: PropTypes.bool,
  fluid: PropTypes.bool,
  required: PropTypes.bool
};

export default FormControl;
