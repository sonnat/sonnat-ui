import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import { Minus, Plus } from "../internals/icons";
import type { MergeElementProps } from "../typings";
import {
  clamp,
  getVar,
  setRef,
  useControlledProp,
  useEventCallback,
  useForkedRefs,
  useIsFocusVisible
} from "../utils";
import {
  allowAdditionAndSubtraction,
  preventAddition,
  preventSubtraction
} from "./actions";
import reducer from "./reducer";
import useStyles from "./styles";

interface InputStepperBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The name of the stepper. */
  name?: string;
  /**
   * The value of the stepper. The DOM API casts this to a string.
   */
  value?: number;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: number;
  /**
   * If `true`, the stepper will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the stepper will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The size of the stepper.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The minimum value the stepper can hold.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value the stepper can hold.
   * @default Infinity
   */
  max?: number;
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
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement>,
    value: number
  ) => void;
  /**
   * The Callback fires when the add button has been clicked.
   */
  onAdd?: (value: number) => void;
  /**
   * The Callback fires when the subtract button has been clicked.
   */
  onSubtract?: (value: number) => void;
}

export type InputStepperProps = Omit<
  MergeElementProps<"div", InputStepperBaseProps>,
  "defaultChecked"
>;

type Component = {
  (props: InputStepperProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<InputStepperProps> | undefined;
  displayName?: string | undefined;
};

const allowedSizes = ["large", "medium", "small"] as const;

// cherry-picked from
// https://stackoverflow.com/questions/42550341/react-trigger-onchange-if-input-value-is-changing-by-state/42554283#answer-59939017
const setNativeValue = (
  element: HTMLInputElement | undefined,
  value: number
) => {
  if (!element) return;

  // eslint-disable-next-line @typescript-eslint/unbound-method
  const valueSetter = Object.getOwnPropertyDescriptor(element, "value")?.set;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const prototype = Object.getPrototypeOf(element);
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(
    prototype,
    "value"
  )?.set;

  if (!valueSetter) return;
  if (!prototypeValueSetter) return;

  if (valueSetter !== prototypeValueSetter)
    prototypeValueSetter.call(element, value);
  else valueSetter.call(element, value);

  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const InputStepperBase = (
  props: InputStepperProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    className,
    onChange,
    inputProps = {},
    name: nameProp,
    value: valueProp,
    defaultValue,
    onAdd: onAddProp,
    onSubtract: onSubtractProp,
    min: minProp = 0,
    max: maxProp = Infinity,
    disabled = false,
    fluid = false,
    size: sizeProp = "medium",
    ...otherProps
  } = props;

  const {
    className: inputClassNameProp,
    id: inputIdProp,
    ref: inputRefProp,
    name: inputNameProp,
    ...otherInputProps
  } = inputProps;

  if (valueProp != null && isNaN(valueProp)) {
    throw new Error(
      `[Sonnat]: Invalid \`value\` property supplied to \`InputStepper\` component. ` +
        `Expected an \`integer\`.`
    );
  } else if (defaultValue != null && isNaN(defaultValue)) {
    throw new Error(
      `[Sonnat]: Invalid \`defaultValue\` property supplied to \`InputStepper\` component. ` +
        `Expected an \`integer\`.`
    );
  }

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

  const classes = useStyles();

  const name = inputNameProp || nameProp;

  const [permissions, dispatch] = React.useReducer(reducer, {
    addition: true,
    subtraction: true
  });

  const inputRef = React.useRef<HTMLInputElement>();

  const { current: min } = React.useRef(minProp);
  const { current: max } = React.useRef(maxProp);

  const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

  const [value, setValue] = useControlledProp(
    valueProp != null ? Math.floor(valueProp) : undefined,
    defaultValue,
    Math.floor(clamp(0, min, max))
  );

  const updateActionVisibility = (newValue: number) => {
    if (newValue === min) dispatch(preventSubtraction());
    else if (newValue === max) dispatch(preventAddition());
    else dispatch(allowAdditionAndSubtraction());
  };

  const onAdd = () => {
    const newValue = clamp(value + 1, min, max);

    if (onAddProp) onAddProp(newValue);
    setValue(newValue);

    setNativeValue(inputRef.current, newValue);
  };

  const onSubtract = () => {
    const newValue = clamp(value - 1, min, max);

    if (onSubtractProp) onSubtractProp(newValue);
    setValue(newValue);

    setNativeValue(inputRef.current, newValue);
  };

  const changeHandler: React.ChangeEventHandler<HTMLInputElement> = e => {
    if (!disabled) {
      const newValue = parseInt(e.target.value);

      if (onChange) onChange(e, newValue);
      setValue(newValue);
    }
  };

  React.useEffect(() => {
    updateActionVisibility(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const {
    isFocusVisibleRef: isIncFocusVisibleRef,
    onBlur: handleIncBlurVisible,
    onFocus: handleIncFocusVisible,
    ref: incFocusVisibleRef
  } = useIsFocusVisible();

  const {
    isFocusVisibleRef: isDecFocusVisibleRef,
    onBlur: handleDecBlurVisible,
    onFocus: handleDecFocusVisible,
    ref: decFocusVisibleRef
  } = useIsFocusVisible();

  const increaseRef = React.useRef<HTMLButtonElement>();
  const decreaseRef = React.useRef<HTMLButtonElement>();

  const handleIncreaseRef = useForkedRefs(incFocusVisibleRef, increaseRef);
  const handleDecreaseRef = useForkedRefs(decFocusVisibleRef, decreaseRef);

  const [isIncFocusVisible, setIncFocusVisible] = React.useState(false);
  const [isDecFocusVisible, setDecFocusVisible] = React.useState(false);

  React.useEffect(() => {
    if (disabled) {
      setIncFocusVisible(false);
      setDecFocusVisible(false);
    }
  }, [disabled]);

  React.useEffect(() => {
    if (!permissions.addition) setIncFocusVisible(false);
    if (!permissions.subtraction) setDecFocusVisible(false);
  }, [permissions]);

  React.useEffect(() => {
    isIncFocusVisibleRef.current = isIncFocusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isIncFocusVisible]);

  React.useEffect(() => {
    isIncFocusVisibleRef.current = isDecFocusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDecFocusVisible]);

  const handleFocus = useEventCallback(
    (event: React.FocusEvent<HTMLButtonElement>, handleType = "increase") => {
      if (handleType === "increase") {
        // Fix for https://github.com/facebook/react/issues/7769
        if (!increaseRef.current) increaseRef.current = event.currentTarget;

        handleIncFocusVisible(event);

        if (isIncFocusVisibleRef.current === true) setIncFocusVisible(true);
      } else if (handleType === "decrease") {
        // Fix for https://github.com/facebook/react/issues/7769
        if (!decreaseRef.current) decreaseRef.current = event.currentTarget;

        handleDecFocusVisible(event);

        if (isDecFocusVisibleRef.current === true) setDecFocusVisible(true);
      }
    }
  );

  const handleBlur = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>, handleType = "increase") => {
      if (handleType === "increase") {
        handleIncBlurVisible(event);

        if (isIncFocusVisibleRef.current === false) setIncFocusVisible(false);
      } else if (handleType === "decrease") {
        handleDecBlurVisible(event);

        if (isDecFocusVisibleRef.current === false) setDecFocusVisible(false);
      }
    }
  );

  return (
    <div
      ref={ref}
      className={c(classes.root, className, {
        [classes[size]]: allowedSizes.includes(size),
        [classes.disabled]: disabled,
        [classes.fluid]: fluid
      })}
      {...otherProps}
    >
      <button
        aria-label={
          name
            ? `Decrease the value of ${name} number input`
            : "Decrease the value"
        }
        ref={handleDecreaseRef}
        tabIndex={!permissions.subtraction ? -1 : 0}
        disabled={!permissions.subtraction}
        className={c(classes.action, classes.subtractAction, {
          [classes.disabled]: !permissions.subtraction,
          [classes.focusVisible]: isDecFocusVisible
        })}
        onClick={() => void onSubtract()}
        onFocus={e => void handleFocus(e, "decrease")}
        onBlur={e => void handleBlur(e, "decrease")}
      >
        <i className={classes.actionIcon}>
          <Minus />
        </i>
      </button>
      <div className={classes.inputContainer}>
        <input
          name={name}
          id={inputIdProp}
          ref={node => {
            setRef(inputRef, node);
            if (inputRefProp) setRef(inputRefProp, node);
          }}
          type="text"
          tabIndex={-1}
          onChange={changeHandler}
          value={value}
          readOnly
          className={c(classes.input, inputClassNameProp)}
          {...otherInputProps}
        />
      </div>
      <button
        aria-label={
          name
            ? `Increase the value of ${name} number input`
            : "Increase the value"
        }
        ref={handleIncreaseRef}
        tabIndex={!permissions.addition ? -1 : 0}
        disabled={!permissions.addition}
        className={c(classes.action, classes.addAction, {
          [classes.disabled]: !permissions.addition,
          [classes.focusVisible]: isIncFocusVisible
        })}
        onClick={() => void onAdd()}
        onFocus={e => void handleFocus(e, "increase")}
        onBlur={e => void handleBlur(e, "increase")}
      >
        <i className={classes.actionIcon}>
          <Plus />
        </i>
      </button>
    </div>
  );
};

const InputStepper = React.forwardRef(InputStepperBase) as Component;

InputStepper.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  fluid: PropTypes.bool,
  onChange: PropTypes.func,
  onAdd: PropTypes.func,
  onSubtract: PropTypes.func,
  inputProps: PropTypes.object,
  size: PropTypes.oneOf(allowedSizes),
  value: PropTypes.number,
  defaultValue: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number
};

export default InputStepper;
