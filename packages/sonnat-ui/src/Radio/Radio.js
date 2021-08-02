import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import useRadioGroup from "../RadioGroup/useRadioGroup";
import useFormControl from "../FormControl/useFormControl";
import useEventListener from "../utils/useEventListener";
import useForkRef from "../utils/useForkRef";
import useControlled from "../utils/useControlled";
import makeStyles from "../styles/makeStyles";
import { changeColor } from "../styles/colorUtils";

const componentName = "Radio";

const allowedSizes = ["large", "medium", "small"];

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
        height: "auto"
      },
      label: useText({ color: colors.text.primary }),
      cell: {
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) }),
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
        appearance: "none !important",
        WebkitTapHighlightColor: "rgba(0, 0, 0, 0) !important"
      },
      button: {
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
        },
        "&:not($disabled)": {
          "& $button": {
            borderColor: !darkMode
              ? colors.createPrimaryColor({ alpha: 0.32 })
              : changeColor(colors.primary.light, { alpha: 0.32 }),
            "&:after": { opacity: 1, transform: "scale(1)" }
          }
        }
      },
      checkedDisabled: {
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
      },
      checkedFocused: {
        "& $cell:before": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColor(colors.primary.light, { alpha: 0.12 })
        }
      },
      large: {
        "& $cell": {
          width: pxToRem(36),
          height: pxToRem(36),
          minWidth: pxToRem(36),
          minHeight: pxToRem(36)
        },
        "& $label": { fontSize: pxToRem(16), lineHeight: 1.625 },
        "& $button": {
          width: pxToRem(18),
          height: pxToRem(18),
          "&:after": { width: pxToRem(10), height: pxToRem(10) }
        }
      },
      medium: {
        "& $cell": {
          width: pxToRem(32),
          height: pxToRem(32),
          minWidth: pxToRem(32),
          minHeight: pxToRem(32)
        },
        "& $label": { fontSize: pxToRem(14), lineHeight: 1.5714285714 },
        "& $button": {
          width: pxToRem(16),
          height: pxToRem(16),
          "&:after": { width: pxToRem(8), height: pxToRem(8) }
        }
      },
      small: {
        "& $cell": {
          width: pxToRem(28),
          height: pxToRem(28),
          minWidth: pxToRem(28),
          minHeight: pxToRem(28)
        },
        "& $label": { fontSize: pxToRem(12), lineHeight: 1.6666666667 },
        "& $button": {
          width: pxToRem(14),
          height: pxToRem(14),
          "&:after": { width: pxToRem(6), height: pxToRem(6) }
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Radio = React.memo(
  React.forwardRef(function Radio(props, ref) {
    const {
      className,
      onChange,
      onFocus,
      onBlur,
      label,
      defaultChecked: defaultCheckedProp,
      value: valueProp,
      name: nameProp,
      checked: checkedProp,
      inputProps = {},
      labelProps = {},
      readOnly = false,
      hasError = false,
      disabled = false,
      required = false,
      size: sizeProp = "medium",
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
      checked: inputCheckedProp,
      defaultChecked: inputDefaultChecked,
      ...otherInputProps
    } = inputProps;

    const { className: labelClassName, ...otherLabelProps } = labelProps;

    const { current: defaultChecked } = useRef(
      checkedProp != null
        ? undefined
        : defaultCheckedProp != null
        ? defaultCheckedProp
        : false
    );

    const inputRef = useRef();
    const inputRefHandler = useForkRef(inputRef, inputRefProp);

    const classes = useStyles();
    const radioGroup = useRadioGroup();
    const formControl = useFormControl();

    const [checked, setChecked] = useControlled(
      checkedProp,
      defaultChecked,
      componentName
    );

    const [isMounted, setMounted] = useState(false);
    const [isFocused, setFocused] = useState(false);

    const size = allowedSizes.includes(sizeProp) ? sizeProp : "medium";

    const isReadOnly = !!inputReadOnly || !!readOnly;

    if (inputCheckedProp != null) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: do not pass the `checked` prop as a `inputProps` property!"
      );
    }
    if (inputDefaultChecked != null) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: do not pass the `defaultChecked` prop as a `inputProps` property!"
      );
    }
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
    if (inputValueProp != null && valueProp != null) {
      // eslint-disable-next-line no-console
      console.error(
        [
          "Sonnat: You are passing the `value` prop twice." +
            "(one as `value` prop and the other one as a property of `inputProps`)",
          `We are assuming \`value="${inputValueProp}"\`!`
        ].join("\n")
      );
    }

    const name = inputNameProp || nameProp;
    const value = inputValueProp || valueProp;

    const checkedState = radioGroup ? radioGroup.value === value : checked;

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
          if (e && e.persist) e.persist();
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
          if (e && e.persist) e.persist();
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
          if (e && e.persist) e.persist();
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
      : id
      ? `radiobox-${id}`
      : undefined;

    if (typeof document !== "undefined") {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEventListener(
        {
          element: document,
          eventName: "keyup",
          listener: keyboardListener
        },
        isFocused
      );
    }

    return (
      <div
        aria-disabled={controlProps.disabled}
        ref={ref}
        className={clx(classes.root, className, classes[size], {
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
            name={controlProps.name}
            value={value}
            id={id}
            tabIndex={controlProps.disabled ? -1 : 0}
            disabled={controlProps.disabled}
            required={controlProps.required}
            className={clx(classes.input, inputClassNameProp)}
            onChange={controlProps.onChange}
            onFocus={controlProps.onFocus}
            onBlur={controlProps.onBlur}
            checked={checkedState}
            type="radio"
            ref={inputRefHandler}
            {...otherInputProps}
          />
          <div className={classes.button}></div>
        </div>
        {label && (
          <label
            className={clx(classes.label, labelClassName)}
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

Radio.displayName = componentName;

Radio.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  readOnly: PropTypes.bool,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  hasError: PropTypes.bool,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  inputProps: PropTypes.object,
  labelProps: PropTypes.object,
  size: PropTypes.oneOf(allowedSizes)
};

export default Radio;
