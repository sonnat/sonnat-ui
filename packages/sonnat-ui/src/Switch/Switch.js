import clx from "classnames";
import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import useFormControl from "../FormControl/useFormControl";
import { changeColor } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";
import getVar from "../utils/getVar";
import useControlled from "../utils/useControlled";
import useEventListener from "../utils/useEventListener";
import useForkRef from "../utils/useForkRef";

const componentName = "Switch";

const allowedSizes = ["large", "medium", "small"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useDisableUserSelect },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        alignItems: "center",
        flexDirection: "row-reverse",
        verticalAlign: "middle"
      },
      label: {
        ...useText({ color: colors.text.primary }),
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) })
      },
      cell: {
        marginRight: pxToRem(9),
        marginLeft: pxToRem(9),
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        "&:hover $button:before": {
          transform: "scale(1)",
          opacity: "1"
        },
        "&:active $button:before": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 })
            : colors.createWhiteColor({ alpha: 0.08 })
        }
      },
      input: {
        width: "100%",
        height: "100%",
        zIndex: "1",
        cursor: "inherit",
        opacity: 0,
        margin: 0,
        appearance: "none !important",
        WebkitTapHighlightColor: "rgba(0, 0, 0, 0) !important"
      },
      button: {
        borderRadius: "50%",
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        zIndex: 2,
        transition: "120ms cubic-bezier(0.4, 0, 0.2, 1)",
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
          zIndex: "-1",
          transformOrigin: "center",
          transition: "240ms ease"
        }
      },
      track: {
        width: "100%",
        height: "100%",
        borderRadius: pxToRem(12),
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: pxToRem(2),
        boxSizing: "border-box",
        transition: "240ms ease",
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.24 })
          : colors.createWhiteColor({ alpha: 0.24 }),
        pointerEvents: "none"
      },
      handle: {
        borderRadius: "50%",
        backgroundColor: colors.white,
        boxShadow: `0px 2px 4px ${colors.createBlackColor({ alpha: 0.24 })}`,
        zIndex: "2",
        pointerEvents: "none"
      },
      indicator: {
        width: "100%",
        height: "100%",
        borderRadius: pxToRem(12),
        top: "0",
        right: "0",
        position: "absolute",
        overflow: "hidden",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backfaceVisibility: "hidden",
        transform: "translate3d(0, 0, 0)",
        zIndex: "1",
        "&:after": {
          ...(direction === "rtl"
            ? { right: pxToRem(-12) }
            : { left: pxToRem(-12) }),
          ...useDisableUserSelect(),
          content: '""',
          width: pxToRem(48),
          height: pxToRem(48),
          borderRadius: "50%",
          backgroundColor: !darkMode
            ? colors.primary.origin
            : colors.primary.light,
          position: "absolute",
          opacity: "0",
          transform: "scale(0)",
          transformOrigin: "center",
          transition:
            "transform 360ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms ease",
          pointerEvents: "none",
          zIndex: "-1"
        }
      },
      focused: {
        "& $button:before": {
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
        "& $cell, & $input, & $track": {
          pointerEvents: "none"
        },
        "& $track": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.08 })
            : colors.createWhiteColor({ alpha: 0.08 })
        },
        "& $handle": {
          boxShadow: "none",
          backgroundColor: !darkMode ? colors.white : colors.black
        }
      },
      checked: {
        "& $indicator:after": {
          opacity: 1,
          transform: "scale(1.25)"
        },
        "& $cell:active $button:before": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.08 })
            : changeColor(colors.primary.light, { alpha: 0.08 })
        },
        "& $button:before": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.04 })
            : changeColor(colors.primary.light, { alpha: 0.04 })
        }
      },
      checkedFocused: {
        "& $button:before": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColor(colors.primary.light, { alpha: 0.12 })
        }
      },
      checkedDisabled: {
        "& $track": { pointerEvents: "none" },
        "& $indicator:after": {
          backgroundColor: colors.divider,
          pointerEvents: "none"
        }
      },
      large: {
        minHeight: pxToRem(44),
        "& $label": { fontSize: pxToRem(16), lineHeight: 1.5 },
        "& $cell": { width: pxToRem(42), height: pxToRem(24) },
        "& $handle": { width: pxToRem(20), height: pxToRem(20) },
        "& $button": {
          ...(direction === "rtl"
            ? { right: pxToRem(-10) }
            : { left: pxToRem(-10) }),
          width: pxToRem(44),
          height: pxToRem(44)
        },
        "&$checked $button": {
          ...(direction === "rtl"
            ? { transform: `translateX(${pxToRem(-18)})` }
            : { transform: `translateX(${pxToRem(18)})` })
        }
      },
      medium: {
        minHeight: pxToRem(34),
        "& $label": { fontSize: pxToRem(14), lineHeight: 1.5714285714 },
        "& $cell": { width: pxToRem(32), height: pxToRem(18) },
        "& $handle": { width: pxToRem(16), height: pxToRem(16) },
        "& $button": {
          ...(direction === "rtl"
            ? { right: pxToRem(-8) }
            : { left: pxToRem(-8) }),
          width: pxToRem(34),
          height: pxToRem(34)
        },
        "&$checked $button": {
          ...(direction === "rtl"
            ? { transform: `translateX(${pxToRem(-14)})` }
            : { transform: `translateX(${pxToRem(14)})` })
        }
      },
      small: {
        minHeight: pxToRem(26),
        "& $label": { fontSize: pxToRem(12), lineHeight: 1.6666666667 },
        "& $cell": { width: pxToRem(24), height: pxToRem(14) },
        "& $handle": { width: pxToRem(12), height: pxToRem(12) },
        "& $button": {
          ...(direction === "rtl"
            ? { right: pxToRem(-6) }
            : { left: pxToRem(-6) }),
          width: pxToRem(26),
          height: pxToRem(26)
        },
        "&$checked $button": {
          ...(direction === "rtl"
            ? { transform: `translateX(${pxToRem(-10)})` }
            : { transform: `translateX(${pxToRem(10)})` })
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Switch = React.memo(
  React.forwardRef(function Switch(props, ref) {
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
    const formControl = useFormControl();

    const [checked, setChecked] = useControlled(
      checkedProp,
      defaultChecked,
      componentName
    );

    const [isMounted, setMounted] = useState(false);
    const [isFocused, setFocused] = useState(false);

    const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

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
      name: name,
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
            if (onChange) onChange(e, !checked);
            if (inputOnChangeProp) inputOnChangeProp(e, !checked);
            setChecked(!checked);
          }
        }
      }
    };

    const id = inputId
      ? inputId
      : controlProps.name && value
      ? `switch-${controlProps.name}-${value}`
      : id
      ? `switch-${id}`
      : undefined;

    if (typeof window !== "undefined") {
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
          [classes.checked]: checked,
          [classes.checkedDisabled]: checked && controlProps.disabled,
          [classes.checkedFocused]: checked && isFocused
        })}
        {...otherProps}
      >
        <div className={classes.cell}>
          <input
            id={id}
            tabIndex={controlProps.disabled ? -1 : 0}
            name={controlProps.name}
            value={value}
            disabled={controlProps.disabled}
            required={controlProps.required}
            className={clx(classes.input, inputClassNameProp)}
            onChange={controlProps.onChange}
            type="checkbox"
            onFocus={controlProps.onFocus}
            onBlur={controlProps.onBlur}
            checked={checked}
            ref={inputRefHandler}
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

Switch.displayName = componentName;

Switch.propTypes = {
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

export default Switch;
