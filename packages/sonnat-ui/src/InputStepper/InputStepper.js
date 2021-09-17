import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { Minus, Plus } from "../internals/icons";
import makeStyles from "../styles/makeStyles";
import { blue } from "../styles/pallete";
import {
  clamp,
  getVar,
  useControlled,
  useEventCallback,
  useForkRef,
  useIsFocusVisible
} from "../utils";
import {
  allowAdditionAndSubtraction,
  preventAddition,
  preventSubtraction
} from "./actions";
import reducer from "./reducer";

const componentName = "InputStepper";

const allowedSizes = ["large", "medium", "small"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useIconWrapper },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    return {
      root: {
        direction: "ltr",
        fontFamily: fontFamily[direction],
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        height: pxToRem(40),
        borderRadius: pxToRem(4),
        border: `${pxToRem(1)} solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.24 })
            : colors.createWhiteColor({ alpha: 0.24 })
        }`,
        transition: "border-color 360ms ease",
        "&:not($disabled):hover": {
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.48 })
            : colors.createWhiteColor({ alpha: 0.48 }),
          "& $input": { color: colors.text.primary }
        }
      },
      action: {
        width: pxToRem(40),
        height: pxToRem(40),
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        justifyItems: "center",
        flexShrink: "0",
        outline: "none",
        border: "none",
        cursor: "pointer",
        padding: "0",
        margin: "0",
        backgroundColor: colors.transparent,
        transition: "background-color 360ms ease",
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 }),
          "&:after, &:before": { opacity: 0 }
        },
        "&:active": {
          backgroundColor: colors.divider,
          "&:after, &:before": { opacity: 0 }
        },
        "&:after, &:before": {
          width: pxToRem(1),
          height: pxToRem(24),
          backgroundColor: colors.divider,
          opacity: "1",
          transition: "opacity 360ms ease"
        },
        "&:after": { marginLeft: "auto" },
        "&:before": { marginRight: "auto" }
      },
      addAction: {
        borderRadius: `0 ${pxToRem(4)} ${pxToRem(4)} 0`,
        "&:before": { content: '""' },
        "& $actionIcon": { marginRight: "auto" }
      },
      subtractAction: {
        borderRadius: `${pxToRem(4)} 0 0 ${pxToRem(4)}`,
        "&:after": { content: '""' },
        "& $actionIcon": { marginLeft: "auto" }
      },
      actionIcon: {
        ...useIconWrapper(20),
        color: colors.text.secondary,
        transition: "color 360ms ease"
      },
      disabledAction: {
        pointerEvents: "none",
        "& $actionIcon": { color: colors.text.disabled }
      },
      input: {
        ...useText({ color: colors.text.hint }),
        textAlign: "center",
        width: "100%",
        height: "100%",
        margin: "0",
        padding: "0",
        outline: "none",
        border: "none",
        backgroundColor: colors.transparent,
        transition: "color 360ms ease",
        "&[readonly]": { pointerEvents: "none" }
      },
      inputContainer: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "1 0",
        height: "100%",
        padding: `0 ${pxToRem(8)}`
      },
      fluid: {
        display: "flex",
        width: "100%"
      },
      disabled: {
        pointerEvents: "none",
        borderColor: colors.divider,
        "& $actionIcon": { color: colors.text.disabled }
      },
      small: {
        height: pxToRem(24),
        "& $action": {
          width: pxToRem(24),
          height: pxToRem(24),
          "&:after,&:before": { height: pxToRem(16) }
        },
        "& $actionIcon": useIconWrapper(14),
        "& $input": { fontSize: pxToRem(12), lineHeight: 1.6666666667 }
      },
      medium: {
        height: pxToRem(32),
        "& $action": {
          width: pxToRem(32),
          height: pxToRem(32),
          "&:after,&:before": { height: pxToRem(16) }
        },
        "& $actionIcon": useIconWrapper(16),
        "& $input": { fontSize: pxToRem(14), lineHeight: 1.5714285714 }
      },
      large: {
        height: pxToRem(40),
        "& $action": {
          width: pxToRem(40),
          height: pxToRem(40),
          "&:after,&:before": { height: pxToRem(24) }
        },
        "& $actionIcon": useIconWrapper(20)
      },
      focusVisible: {
        outline: `2px solid ${darkMode ? blue[300] : blue[500]}`,
        outlineOffset: 1
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

// cherry-picked from
// https://stackoverflow.com/questions/42550341/react-trigger-onchange-if-input-value-is-changing-by-state/42554283#answer-59939017
const setNativeValue = (element, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(
    prototype,
    "value"
  ).set;

  if (!valueSetter) return;

  if (valueSetter !== prototypeValueSetter)
    prototypeValueSetter.call(element, value);
  else valueSetter.call(element, value);

  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const InputStepper = React.forwardRef(function InputStepper(props, ref) {
  const {
    className,
    onChange,
    inputProps = {},
    name: nameProp,
    value: valueProp,
    defaultValue: defaultValueProp,
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
    onChange: inputOnChangeProp,
    ...otherInputProps
  } = inputProps;

  if (valueProp != null && isNaN(valueProp)) {
    throw new Error(
      `[Sonnat]: Invalid \`value\` property supplied to \`${componentName}\` component. ` +
        `Expected an \`integer\`.`
    );
  } else if (defaultValueProp != null && isNaN(defaultValueProp)) {
    throw new Error(
      `[Sonnat]: Invalid \`defaultValue\` property supplied to \`${componentName}\` component. ` +
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

  const inputRef = React.useRef(null);
  const handleInputRef = useForkRef(inputRef, inputRefProp);

  const { current: min } = React.useRef(minProp);
  const { current: max } = React.useRef(maxProp);

  const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

  const { current: defaultValue } = React.useRef(
    valueProp != null
      ? undefined
      : Math.floor(
          clamp(defaultValueProp != null ? defaultValueProp : 0, min, max)
        )
  );

  const [value, setValue] = useControlled(
    valueProp != null ? Math.floor(valueProp) : undefined,
    defaultValue,
    componentName
  );

  const updateActionVisibility = newValue => {
    if (newValue === min) dispatch(preventSubtraction());
    else if (newValue === max) dispatch(preventAddition());
    else dispatch(allowAdditionAndSubtraction());
  };

  const onAdd = e => {
    const newValue = clamp(value + 1, min, max);

    if (onAddProp) onAddProp(e, newValue);
    setValue(newValue);

    setNativeValue(inputRef.current, newValue);
  };

  const onSubtract = e => {
    const newValue = clamp(value - 1, min, max);

    if (onSubtractProp) onSubtractProp(e, newValue);
    setValue(newValue);

    setNativeValue(inputRef.current, newValue);
  };

  const changeHandler = e => {
    if (!disabled) {
      const newValue = parseInt(e.target.value);

      if (onChange) onChange(e, newValue);
      if (inputOnChangeProp) inputOnChangeProp(e, newValue);
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

  const increaseRef = React.useRef(null);
  const decreaseRef = React.useRef(null);

  const handleIncreaseRef = useForkRef(incFocusVisibleRef, increaseRef);
  const handleDecreaseRef = useForkRef(decFocusVisibleRef, decreaseRef);

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

  const handleFocus = useEventCallback((event, handleType = "increase") => {
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
  });

  const handleBlur = useEventCallback((event, handleType = "increase") => {
    if (handleType === "increase") {
      handleIncBlurVisible(event);

      if (isIncFocusVisibleRef.current === false) setIncFocusVisible(false);
    } else if (handleType === "decrease") {
      handleDecBlurVisible(event);

      if (isDecFocusVisibleRef.current === false) setDecFocusVisible(false);
    }
  });

  return (
    <div
      ref={ref}
      className={clx(classes.root, className, {
        [classes[size]]: allowedSizes.includes(size),
        [classes.disabled]: disabled,
        [classes.fluid]: fluid
      })}
      {...otherProps}
    >
      <button
        aria-label={`Decrease the value of ${name} number input`}
        ref={handleDecreaseRef}
        tabIndex={!permissions.subtraction ? -1 : 0}
        disabled={!permissions.subtraction}
        className={clx(classes.action, classes.subtractAction, {
          [classes.disabled]: !permissions.subtraction,
          [classes.focusVisible]: isDecFocusVisible
        })}
        onClick={onSubtract}
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
          ref={handleInputRef}
          type="text"
          tabIndex={-1}
          onChange={changeHandler}
          value={value}
          readOnly
          className={clx(classes.input, inputClassNameProp)}
          {...otherInputProps}
        />
      </div>
      <button
        aria-label={`Increase the value of ${name} number input`}
        ref={handleIncreaseRef}
        tabIndex={!permissions.addition ? -1 : 0}
        disabled={!permissions.addition}
        className={clx(classes.action, classes.addAction, {
          [classes.disabled]: !permissions.addition,
          [classes.focusVisible]: isIncFocusVisible
        })}
        onClick={onAdd}
        onFocus={e => void handleFocus(e, "increase")}
        onBlur={e => void handleBlur(e, "increase")}
      >
        <i className={classes.actionIcon}>
          <Plus />
        </i>
      </button>
    </div>
  );
});

InputStepper.displayName = componentName;

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
