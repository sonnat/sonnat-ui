import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import useFormControl from "../FormControl/useFormControl";
import useRadioGroup from "../RadioGroup/useRadioGroup";
import type { MergeElementProps } from "../typings";
import {
  getVar,
  setRef,
  useControlledProp,
  useEventCallback,
  useForkedRefs,
  useId,
  useIsFocusVisible,
  useIsMounted,
  useIsomorphicLayoutEffect
} from "../utils";
import useStyles from "./styles";

interface RadioBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `label` text provided, a `<label>` will be rendered next to the radio.
   */
  label?: string;
  /** The name of the radio. */
  name?: string;
  /**
   * The value of the radio. The DOM API casts this to a string.
   * The browser uses "on" as the default value.
   */
  value?: string;
  /**
   * If `true`, the radio will be focused automatically.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the radio will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the radio will be checked.
   */
  checked?: boolean;
  /**
   * The default state of `checked`. Use when the component is not controlled.
   */
  defaultChecked?: boolean;
  /**
   * If `true`, the radio will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the radio will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the radio will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * The size of the radio.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The Callback fires when the state has changed.
   */
  onChange?: (checkedState: boolean) => void;
  /**
   * The Callback fires when the radio has received focus.
   */
  onFocus?: (event: FocusEvent) => void;
  /**
   * The Callback fires when the radio has lost focus.
   */
  onBlur?: (event: FocusEvent) => void;
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
  /** The properties applied to the `label` element. */
  labelProps?: React.ComponentPropsWithRef<"label">;
}

export type RadioProps = MergeElementProps<"div", RadioBaseProps>;

type Component = {
  (props: RadioProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<RadioProps> | undefined;
  displayName?: string | undefined;
};

const allowedSizes = ["large", "medium", "small"] as const;

const RadioBase = (props: RadioProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    label,
    id: idProp,
    defaultChecked,
    value,
    name: nameProp,
    checked: checkedProp,
    inputProps = {},
    labelProps = {},
    readOnly = false,
    hasError = false,
    disabled = false,
    required = false,
    autoFocus: autoFocusProp = false,
    size: sizeProp = "medium",
    ...otherProps
  } = props;

  const {
    className: inputClassNameProp,
    id: inputId,
    ref: inputRefProp,
    name: inputNameProp,
    autoFocus: inputAutoFocus = false,
    readOnly: inputReadOnly = false,
    ...otherInputProps
  } = inputProps;

  const { className: labelClassName, ...otherLabelProps } = labelProps;

  const inputRef = React.useRef<HTMLInputElement>();

  const classes = useStyles();
  const radioGroup = useRadioGroup();
  const formControl = useFormControl();

  const [checked, setChecked] = useControlledProp(
    checkedProp,
    defaultChecked,
    false
  );

  const isMounted = useIsMounted();

  const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

  const isReadOnly = !!inputReadOnly || !!readOnly;

  if (inputNameProp != null && nameProp != null) {
    // eslint-disable-next-line no-console
    console.error(
      [
        "Sonnat: You are passing the `name` prop twice." +
          "(one as `name` prop and the other one as a property of `inputProps`)",
        `We are assuming \`name="${inputNameProp}"\`!`
      ].join("\n")
    );
  }

  const isFormControlFocused = formControl ? !!formControl.focusedState : false;

  const autoFocus = isFormControlFocused || !!inputAutoFocus || autoFocusProp;

  const name = inputNameProp || nameProp;

  const checkedState = radioGroup ? radioGroup.value === value : checked;

  const controlProps = {
    disabled: formControl ? formControl.disabled : disabled,
    hasError: formControl ? formControl.hasError : hasError,
    required: formControl ? formControl.required : required,
    onFocus: (e: React.FocusEvent<HTMLDivElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onFocus) onFocus(e as unknown as FocusEvent);
        if (formControl && formControl.onFocus) formControl.onFocus();
      }
    },
    onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onBlur) onBlur(e as unknown as FocusEvent);
        if (formControl && formControl.onBlur) formControl.onBlur();
      }
    },
    onChange: () => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onChange) onChange(true);
        if (radioGroup && radioGroup.onChange) radioGroup.onChange(value);
        setChecked(true);
      }
    }
  };

  const id = useId(inputId || idProp, "RADIO");

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const rootRef = React.useRef<HTMLDivElement>();

  const handleRef = useForkedRefs(ref, focusVisibleRef, rootRef);

  const [isFocused, setFocused] = React.useState(autoFocus);

  // prevent component from being focused if it is disabled
  React.useEffect(() => {
    if (controlProps.disabled && isFocused) {
      setFocused(false);
    }
  }, [controlProps.disabled, isFocused]);

  // initially focus the component
  useIsomorphicLayoutEffect(() => {
    if (!(controlProps.disabled || isReadOnly)) {
      if (autoFocus && rootRef.current) rootRef.current.focus();
    }
  }, [autoFocus]);

  React.useEffect(() => {
    isFocusVisibleRef.current = isFocused;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const handleFocus = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!rootRef.current) rootRef.current = event.currentTarget;

      handleFocusVisible(event);

      if (isFocusVisibleRef.current === true) setFocused(true);
      controlProps.onFocus(event);
    }
  );

  const handleBlur = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      handleBlurVisible(event);

      if (isFocusVisibleRef.current === false) setFocused(false);
      controlProps.onBlur(event);
    }
  );

  const keyDownRef = React.useRef(false);

  const handleKeyDown = useEventCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (keyDownRef.current === false && isFocused && event.key === " ")
        keyDownRef.current = true;

      if (event.target === event.currentTarget && event.key === " ")
        event.preventDefault();

      if (onKeyDown) onKeyDown(event);
    }
  );

  const handleKeyUp = useEventCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!event.defaultPrevented && isFocused && event.key === " ")
        keyDownRef.current = false;

      if (onKeyUp) onKeyUp(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        event.key === " " &&
        !event.defaultPrevented &&
        !checkedState
      ) {
        controlProps.onChange();
      }
    }
  );

  return (
    <div
      id={idProp}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={controlProps.disabled}
      ref={handleRef}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={c(classes.root, className, classes[size], {
        [classes.disabled]: controlProps.disabled,
        [classes.focused]: isFocused,
        [classes.checked]: checkedState,
        [classes.checkedDisabled]: checkedState && controlProps.disabled,
        [classes.checkedFocused]: checkedState && isFocused
      })}
      {...otherProps}
    >
      <div className={classes.cell}>
        <input
          id={id}
          tabIndex={-1}
          name={name}
          value={value}
          disabled={controlProps.disabled}
          required={controlProps.required}
          className={c(classes.input, inputClassNameProp)}
          onChange={controlProps.onChange}
          type="radio"
          checked={checkedState}
          ref={node => {
            setRef(inputRef, node);
            if (inputRefProp) setRef(inputRefProp, node);
          }}
          {...otherInputProps}
        />
        <div className={classes.button}></div>
      </div>
      {label && (
        <label
          className={c(classes.label, labelClassName)}
          htmlFor={id}
          {...otherLabelProps}
        >
          {label}
        </label>
      )}
    </div>
  );
};

const Radio = React.forwardRef(RadioBase) as Component;

Radio.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  autoFocus: PropTypes.bool,
  readOnly: PropTypes.bool,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  hasError: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  inputProps: PropTypes.object,
  labelProps: PropTypes.object,
  size: PropTypes.oneOf(allowedSizes)
};

export default Radio;
