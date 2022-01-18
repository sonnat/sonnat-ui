/* eslint-disable @typescript-eslint/no-non-null-assertion */
import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import useFormControl from "../FormControl/useFormControl";
import InputBase from "../InputBase";
import SelectContext from "../Select/context";
import type { MergeElementProps } from "../typings";
import {
  clamp,
  getVar,
  setRef,
  useControlledProp,
  useId,
  useIsMounted,
  useIsomorphicLayoutEffect
} from "../utils";
import TextFieldContext from "./context";
import useStyles from "./styles";

interface TextFieldBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The name of the text field. */
  name?: string;
  /** The `placeholder` property of the text field. */
  placeholder?: string;
  /**
   * The value of the text field. The DOM API casts this to a string.
   */
  value?: string;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: string;
  /** The helper text content. */
  helperText?: string;
  /** The helper icon element placed before the helper text. */
  helperIcon?: React.ReactNode;
  /**
   * The leading adornment for this component.
   *
   * This can be used to add a prefix, an action, or an icon to the leading of your input.
   */
  leadingAdornment?: React.ReactNode;
  /**
   * The trailing adornment for this component.
   *
   * This can be used to add a suffix, an action, or an icon to the trailing of your input.
   */
  trailingAdornment?: React.ReactNode;
  /**
   * If `true`, the text field will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the text field will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the text field will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * If `true`, the text field will be focused on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the text field will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the text field will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the text field will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the text field will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * The size of the text field.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The variant of the text field.
   * @default "outlined"
   */
  variant?: "filled" | "outlined";
  /**
   * The type of the input.
   * @default "text"
   */
  type?: "text" | "email" | "password" | "number" | "url";
  /** The properties applied to the `input` element. */
  inputProps?: Omit<
    React.ComponentPropsWithRef<"input">,
    | "value"
    | "checked"
    | "defaultChecked"
    | "defaultValue"
    | "onChange"
    | "onBlur"
    | "onFocus"
  >;
  /**
   * The Callback fires when the state has changed.
   */
  onChange?: (value: string) => void;
  /**
   * The Callback fires when the text field has received focus.
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * The Callback fires when the text field has lost focus.
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
}

export type TextFieldProps = Omit<
  MergeElementProps<"div", TextFieldBaseProps>,
  "defaultChecked"
>;

type Component = {
  (props: TextFieldProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TextFieldProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["filled", "outlined"] as const;
const allowedSizes = ["large", "medium", "small"] as const;
const allowedTypes = ["text", "email", "password", "number", "url"] as const;

const isEmpty = (value: unknown) =>
  value === undefined || value === null || value === "";

const TextFieldBase = (
  props: TextFieldProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    placeholder,
    className,
    onChange,
    onFocus,
    onBlur,
    helperText,
    helperIcon,
    leadingAdornment,
    trailingAdornment,
    defaultValue,
    inputProps = {},
    id: idProp,
    name: nameProp,
    value: valueProp,
    variant: variantProp = "outlined",
    size: sizeProp = "medium",
    type: typeProp = "text",
    autoFocus = false,
    focused = false,
    readOnly = false,
    disabled = false,
    fluid = false,
    rounded = false,
    hasError = false,
    required = false,
    ...otherProps
  } = props;

  const {
    className: inputClassNameProp,
    id: inputIdProp,
    ref: inputRefProp,
    name: inputNameProp,
    readOnly: inputReadOnlyProp = false,
    autoFocus: inputAutoFocusProp = false,
    ...otherInputProps
  } = inputProps;

  if (inputNameProp != null && nameProp != null) {
    // eslint-disable-next-line no-console
    console.error(
      [
        "Sonnat: You are passing the `name` prop twice." +
          "(one as `name` property and the other one as a property of `inputProps`)",
        `We are assuming \`name="${inputNameProp}"\`!`
      ].join("\n")
    );
  }

  const name = inputNameProp || nameProp;

  const inputRef = React.useRef<HTMLInputElement>();

  const classes = useStyles();
  const formControl = useFormControl();

  const selectContext = React.useContext(SelectContext);

  const isSelectDeepChild = !!selectContext;

  const [value, setValue] = useControlledProp(valueProp, defaultValue, "");

  const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

  const variant = getVar(
    variantProp,
    "outlined",
    !allowedVariants.includes(variantProp)
  );

  const type = getVar(typeProp, "text", !allowedTypes.includes(typeProp));

  const { current: initialValue } = React.useRef(value);

  const formControlFocusState = formControl
    ? formControl.focusedState
    : undefined;

  const { current: isAutoFocus } = React.useRef(
    isSelectDeepChild
      ? !!inputAutoFocusProp || autoFocus || focused
      : typeof formControlFocusState === "undefined"
      ? !!inputAutoFocusProp || autoFocus || focused
      : formControlFocusState
  );

  const isReadOnly = !!inputReadOnlyProp || readOnly;
  const hasLimitedLength = !!otherInputProps.maxLength;

  const isMounted = useIsMounted();

  const [isFocused, setFocused] = React.useState(isAutoFocus);

  const [charCount, setCharCount] = React.useState(
    clamp(
      initialValue.length,
      0,
      hasLimitedLength ? otherInputProps.maxLength! : Infinity
    )
  );

  const finalValue = hasLimitedLength
    ? value.substr(0, otherInputProps.maxLength)
    : value;

  let focusState = isSelectDeepChild
    ? isFocused
    : typeof formControlFocusState === "boolean"
    ? formControlFocusState
    : isFocused;

  // inherit properties from FormControl
  const controlProps = {
    disabled: formControl ? formControl.disabled : disabled,
    hasError: formControl ? formControl.hasError : hasError,
    required: formControl ? formControl.required : required,
    fluid: formControl ? formControl.fluid : fluid,
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onFocus) onFocus(e);
        if (!isSelectDeepChild && formControl && formControl.onFocus)
          formControl.onFocus();
        setFocused(true);
      }
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onBlur) onBlur(e);
        if (!isSelectDeepChild && formControl && formControl.onBlur)
          formControl.onBlur();
        setFocused(false);
      }
    },
    onChange: (e: React.FocusEvent<HTMLInputElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onChange) onChange(e.target.value);
        setValue(e.target.value);
        setCharCount(e.target.value.length);
      }
    }
  };

  const id = useId(inputIdProp || idProp, "TEXTFIELD");

  if (process.env.NODE_ENV !== "production") {
    if (controlProps.disabled && isReadOnly) {
      throw new Error(
        "[Sonnat]: You can't use `disabled` and `readOnly` props at the same time!"
      );
    }
  }

  if ((controlProps.disabled || isReadOnly) && focusState) focusState = false;

  // initially focus the component
  useIsomorphicLayoutEffect(() => {
    if (!(controlProps.disabled || isReadOnly)) {
      if (isAutoFocus && inputRef.current) {
        inputRef.current.focus();
        setFocused(true);
      }
    }
  }, []);

  return (
    <TextFieldContext.Provider value={{ isEmpty: isEmpty(value) }}>
      <div
        id={idProp}
        ref={ref}
        className={c(classes.root, className, classes[size], {
          [classes.fluid]: controlProps.fluid,
          [classes.disabled]: controlProps.disabled,
          [classes.errored]: controlProps.hasError
        })}
        {...otherProps}
      >
        <InputBase
          focused={focusState}
          readOnly={isReadOnly}
          rounded={rounded}
          hasError={controlProps.hasError}
          disabled={controlProps.disabled}
          fluid={controlProps.fluid}
          size={size}
          variant={variant}
          leadingAdornment={leadingAdornment}
          trailingAdornment={trailingAdornment}
          className={c(classes.base, {
            [classes.disabled]: controlProps.disabled,
            [classes.errored]: controlProps.hasError
          })}
          controller={
            <input
              id={id}
              name={name}
              value={finalValue}
              placeholder={placeholder}
              readOnly={isReadOnly}
              disabled={controlProps.disabled}
              required={controlProps.required}
              className={c(classes.input, inputClassNameProp)}
              ref={node => {
                if (inputRefProp) setRef(inputRefProp, node);
                setRef(inputRef, node);
              }}
              type={type}
              onFocus={controlProps.onFocus}
              onBlur={controlProps.onBlur}
              onChange={controlProps.onChange}
              tabIndex={controlProps.disabled || isReadOnly ? -1 : 0}
              {...otherInputProps}
            />
          }
        />
        {(!!helperText || !!otherInputProps.maxLength) && (
          <div className={classes.helperRow}>
            {helperText && (
              <p className={classes.helperContent}>
                {helperIcon && (
                  <i className={classes.helperIcon}>{helperIcon}</i>
                )}
                <span className={classes.helperText}>{helperText}</span>
              </p>
            )}
            {hasLimitedLength && (
              <div className={classes.charCount}>
                {charCount} / {otherInputProps.maxLength}
              </div>
            )}
          </div>
        )}
      </div>
    </TextFieldContext.Provider>
  );
};

const TextField = React.forwardRef(TextFieldBase) as Component;

TextField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  defaultValue: PropTypes.string,
  helperIcon: PropTypes.node,
  leadingAdornment: PropTypes.node,
  trailingAdornment: PropTypes.node,
  focused: PropTypes.bool,
  autoFocus: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  hasError: PropTypes.bool,
  required: PropTypes.bool,
  fluid: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  inputProps: PropTypes.object,
  size: PropTypes.oneOf(allowedSizes),
  variant: PropTypes.oneOf(allowedVariants),
  type: PropTypes.oneOf(allowedTypes)
};

export default TextField;
