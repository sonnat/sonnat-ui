import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import useFormControl from "../FormControl/useFormControl";
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

interface SwitchBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `label` text provided, a `<label>` will be rendered next to the switch.
   */
  label?: string;
  /** The name of the switch. */
  name?: string;
  /**
   * The value of the switch. The DOM API casts this to a string.
   * The browser uses "on" as the default value.
   */
  value?: string;
  /**
   * The size of the switch.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * If `true`, the switch will be focused automatically.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the switch will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the switch will be checked.
   * @default false
   */
  checked?: boolean;
  /**
   * The default state of `checked`. Use when the component is not controlled.
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * If `true`, the switch will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the switch will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the switch will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * The Callback fires when the state has changed.
   */
  onChange?: (checkedState: boolean) => void;
  /**
   * The Callback fires when the switch has received focus.
   */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /**
   * The Callback fires when the switch has lost focus.
   */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
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

export type SwitchProps = MergeElementProps<"div", SwitchBaseProps>;

type Component = {
  (props: SwitchProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<SwitchProps> | undefined;
  displayName?: string | undefined;
};

const allowedSizes = ["large", "medium", "small"] as const;

const SwitchBase = (props: SwitchProps, ref: React.Ref<HTMLDivElement>) => {
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

  const controlProps = {
    name: name,
    disabled: formControl ? formControl.disabled : disabled,
    hasError: formControl ? formControl.hasError : hasError,
    required: formControl ? formControl.required : required,
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onFocus) onFocus(e);
        if (formControl && formControl.onFocus) formControl.onFocus();
      }
    },
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onBlur) onBlur(e);
        if (formControl && formControl.onBlur) formControl.onBlur();
      }
    },
    onChange: () => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onChange) onChange(!checked);
        setChecked(!checked);
      }
    }
  };

  const id = useId(inputId || idProp, "SWITCH");

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
      controlProps.onFocus(event as React.FocusEvent<HTMLInputElement>);
    }
  );

  const handleBlur = useEventCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
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
        !event.defaultPrevented
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
        [classes.checked]: checked,
        [classes.checkedDisabled]: checked && controlProps.disabled,
        [classes.checkedFocused]: checked && isFocused
      })}
      {...otherProps}
    >
      <div className={classes.cell}>
        <input
          id={id}
          tabIndex={-1}
          name={controlProps.name}
          value={value}
          disabled={controlProps.disabled}
          required={controlProps.required}
          className={c(classes.input, inputClassNameProp)}
          onChange={controlProps.onChange}
          type="checkbox"
          checked={checked}
          ref={node => {
            if (inputRefProp) setRef(inputRefProp, node);
            setRef(inputRef, node);
          }}
          {...otherInputProps}
        />
        <div className={classes.track}>
          <div className={classes.button}>
            <div className={classes.handle}></div>
          </div>
          <div className={classes.indicator}></div>
        </div>
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

const Switch = React.forwardRef(SwitchBase) as Component;

Switch.propTypes = {
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

export default Switch;
