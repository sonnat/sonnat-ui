import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import useRadioGroup from "../RadioGroup/useRadioGroup";
import useFormControl from "../FormControl/useFormControl";
import useEventListener from "../utils/useEventListener";
import useForkRef from "../utils/useForkRef";
import makeStyles from "../styles/makeStyles";
import { changeColor } from "../styles/colorUtils";

const componentName = "RadioButton";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        boxSizing: "content-box",
        verticalAlign: "middle",
        height: "auto",
        minHeight: pxToRem(40),
        "&$checked:not($disabled)": {
          "& $button": {
            borderColor: !darkMode
              ? colors.createPrimaryColor({ alpha: 0.32 })
              : changeColor(colors.primary.light, { alpha: 0.32 }),
            "&:after": { opacity: 1, transform: "scale(1)" }
          }
        },
        "&$checked$disabled": {
          "& $button": {
            pointerEvents: "none",
            borderColor: colors.transparent,
            backgroundColor: colors.divider,
            "&:after": {
              opacity: 1,
              transform: "scale(1)",
              backgroundColor: !darkMode ? colors.white : colors.black
            }
          }
        }
      },
      label: useText({
        fontSize: pxToRem(16),
        color: colors.text.primary
      }),
      cell: {
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) }),
        width: pxToRem(36),
        height: pxToRem(36),
        minWidth: pxToRem(36),
        minHeight: pxToRem(36),
        borderRadius: "50%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        cursor: "pointer",
        backfaceVisibility: "hidden",
        transform: "translate3d(0, 0, 0)",
        zIndex: "1",
        "&:before": {
          content: '""',
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          position: "absolute",
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 }),
          transform: "scale(0)",
          opacity: "0",
          transformOrigin: "center",
          transition:
            "transform 240ms ease, opacity 240ms ease, background-color 240ms ease"
        },
        "&:hover:before": {
          transform: "scale(1)",
          opacity: "1"
        }
      },
      input: {
        width: "100%",
        height: "100%",
        opacity: "0",
        margin: 0,
        zIndex: "1",
        cursor: "inherit",
        WebkitAppearance: "none",
        WebkitTapHighlightColor: "rgba(0, 0, 0, 0) !important"
      },
      button: {
        width: pxToRem(18),
        height: pxToRem(18),
        border: `1px solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.24 })
            : colors.createWhiteColor({ alpha: 0.24 })
        }`,
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        overflow: "hidden",
        transition:
          "border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1)",
        "&:after": {
          content: '""',
          width: pxToRem(10),
          height: pxToRem(10),
          borderRadius: "50%",
          backgroundColor: !darkMode
            ? colors.primary.origin
            : colors.primary.light,
          opacity: "0",
          transform: "scale(0)",
          transformOrigin: "center",
          transition:
            "background-color 240ms ease, opacity 240ms ease, transform 240ms ease"
        }
      },
      focused: {
        "& $cell:before": {
          transform: "scale(1)",
          opacity: "1",
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.12 })
            : colors.createWhiteColor({ alpha: 0.12 })
        },
        "&$checked $cell:before": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColor(colors.primary.light, { alpha: 0.12 })
        }
      },
      disabled: {
        cursor: "not-allowed !important",
        "& $label": {
          pointerEvents: "none",
          color: colors.text.disabled
        },
        "& $cell, & $input, & $button": {
          pointerEvents: "none"
        },
        "& $button": {
          borderColor: colors.divider
        }
      },
      checked: {
        "& $cell:before": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.04 })
            : changeColor(colors.primary.light, { alpha: 0.04 })
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const RadioButton = React.memo(
  React.forwardRef(function RadioButton(props, ref) {
    const {
      className,
      onChange,
      onFocus,
      onBlur,
      label,
      value: valueProp,
      name: nameProp,
      inputProps = {},
      labelProps = {},
      readOnly = false,
      hasError = false,
      checked = false,
      disabled = false,
      required = false,
      ...otherProps
    } = props;

    const {
      className: inputClassNameProp,
      id: inputId,
      ref: inputRefProp,
      name: inputNameProp,
      value: inputValueProp,
      onChange: inputOnChangeProp,
      onFocus: inputOnFocusProp,
      onBlur: inputOnBlurProp,
      readOnly: inputReadOnly = false,
      ...otherInputProps
    } = inputProps;

    const { className: labelClassName, ...otherLabelProps } = labelProps;

    const inputRef = useRef();
    const inputRefHandler = useForkRef(inputRef, inputRefProp);

    const localClass = useStyles();
    const radioGroup = useRadioGroup();
    const formControl = useFormControl();

    const [isMounted, setMounted] = useState(false);
    const [isChecked, setChecked] = useState(checked);
    const [isFocused, setFocused] = useState(false);

    const isReadOnly = !!inputReadOnly || !!readOnly;

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
    if (inputValueProp != null && valueProp != null) {
      // eslint-disable-next-line no-console
      console.error(
        [
          "Sonnat: You are passing the `value` prop twice." +
            "(one as `value` property and the other one as a property of `inputProps`)",
          `We are assuming \`value="${inputValueProp}"\`!`
        ].join("\n")
      );
    }

    const name = inputNameProp || nameProp;
    const value = inputValueProp || valueProp;

    const checkedState = radioGroup ? radioGroup.value === value : isChecked;

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    const keyboardListener = useCallback(e => {
      // do nothing if the event was already processed
      if (e.defaultPrevented) return;

      if (e.key === " " || e.key === "Spacebar") {
        // preventing the default behaviour
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = null;

        inputRef.current.click();
      }
    }, []);

    const controlProps = {
      name: radioGroup ? radioGroup.name : name,
      disabled: formControl ? formControl.disabled : disabled,
      hasError: formControl ? formControl.hasError : hasError,
      required: formControl ? formControl.required : required,
      onFocus: e => {
        if (isMounted) {
          e.persist();
          if (!(controlProps.disabled || isReadOnly)) {
            if (onFocus) onFocus(e);
            if (inputOnFocusProp) inputOnFocusProp(e);
            if (formControl && formControl.onFocus) formControl.onFocus(e);
            else setFocused(true);
          }
        }
      },
      onBlur: e => {
        if (isMounted) {
          e.persist();
          if (!(controlProps.disabled || isReadOnly)) {
            if (onBlur) onBlur(e);
            if (inputOnBlurProp) inputOnBlurProp(e);
            if (formControl && formControl.onBlur) formControl.onBlur(e);
            else setFocused(false);
          }
        }
      },
      onChange: e => {
        if (isMounted) {
          e.persist();
          if (!(controlProps.disabled || isReadOnly)) {
            if (onChange) onChange(e, true);
            if (inputOnChangeProp) inputOnChangeProp(e, true);
            if (radioGroup && radioGroup.onChange) radioGroup.onChange(e);
            setChecked(true);
          }
        }
      }
    };

    const id = inputId
      ? inputId
      : controlProps.name && value
      ? `radiobox-${controlProps.name}-${value}`
      : undefined;

    useEventListener(
      {
        element: typeof document !== "undefined" ? document : undefined,
        eventName: "keyup",
        listener: keyboardListener
      },
      isFocused
    );

    return (
      <div
        aria-disabled={controlProps.disabled}
        ref={ref}
        className={createClass(localClass.root, className, {
          [localClass.disabled]: controlProps.disabled,
          [localClass.focused]: isFocused,
          [localClass.checked]: checkedState
        })}
        {...otherProps}
      >
        <div className={localClass.cell}>
          <input
            name={controlProps.name}
            value={value}
            id={id}
            tabIndex={controlProps.disabled ? "-1" : "0"}
            disabled={controlProps.disabled}
            required={controlProps.required}
            className={createClass(localClass.input, inputClassNameProp)}
            onChange={controlProps.onChange}
            onFocus={controlProps.onFocus}
            onBlur={controlProps.onBlur}
            checked={checkedState}
            type="radio"
            ref={inputRefHandler}
            {...otherInputProps}
          />
          <div className={localClass.button}></div>
        </div>
        {label && (
          <label
            className={createClass(localClass.label, labelClassName)}
            htmlFor={id}
            {...otherLabelProps}
          >
            {label}
          </label>
        )}
      </div>
    );
  })
);

RadioButton.displayName = componentName;

RadioButton.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  hasError: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  inputProps: PropTypes.object,
  labelProps: PropTypes.object
};

export default RadioButton;
