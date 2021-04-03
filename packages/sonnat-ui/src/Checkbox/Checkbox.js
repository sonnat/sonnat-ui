import React, { useState, useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import useFormControl from "../FormControl/useFormControl";
import useCheckGroup from "../CheckGroup/useCheckGroup";
import useEventListener from "../utils/useEventListener";
import useForkRef from "../utils/useForkRef";
import makeStyles from "../styles/makeStyles";
import { changeColor } from "../styles/colorUtils";

const componentName = "Checkbox";

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
        "&$checked$disabled": {
          "& $button": {
            pointerEvents: "none",
            borderColor: colors.transparent,
            backgroundColor: colors.divider
          }
        },
        "&$checked": {
          "& $button": {
            borderColor: !darkMode
              ? colors.primary.origin
              : colors.primary.light,
            backgroundColor: !darkMode
              ? colors.primary.origin
              : colors.primary.light
          },
          "& $checkIcon polyline": {
            opacity: 1,
            animation:
              "$checkAnimation 200ms cubic-bezier(0.65, 0, 0.45, 1) 48ms forwards"
          }
        },
        "&:not($checked)$indeterminated": {
          "&:not($disabled)": {
            "& $button": {
              borderColor: !darkMode
                ? colors.primary.origin
                : colors.primary.light,
              backgroundColor: !darkMode
                ? colors.primary.origin
                : colors.primary.light
            },
            "& $checkIcon": {
              transform: "rotate(-360deg)",
              "& line": {
                opacity: "1",
                transform: "scale(1)",
                transformOrigin: "0 center",
                transition: "opacity 200ms ease, transform 200ms ease"
              }
            }
          },
          "&$disabled": {
            "& $button": {
              pointerEvents: "none",
              borderColor: colors.transparent,
              backgroundColor: colors.divider
            },
            "& $checkIcon": {
              transform: "rotate(-360deg)",
              "& line": {
                opacity: "1",
                transform: "scale(1)",
                transformOrigin: "0 center",
                transition: "opacity 200ms ease, transform 200ms ease"
              }
            }
          }
        }
      },
      label: useText({
        fontSize: pxToRem(16),
        color: colors.text.primary
      }),
      cell: {
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
        },
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) })
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
        borderRadius: pxToRem(2),
        overflow: "hidden",
        transition:
          "border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1)"
      },
      checkIcon: {
        width: pxToRem(18),
        height: pxToRem(18),
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        justifyContent: "center",
        transition: "transform 400ms ease",
        "& svg": {
          width: pxToRem(12),
          height: pxToRem(8)
        },
        "& polyline": {
          fill: "none",
          strokeLinecap: "round",
          strokeLinejoin: "round",
          stroke: colors.getContrastColorOf(
            !darkMode ? colors.primary.origin : colors.primary.light
          ),
          strokeWidth: "2",
          strokeDasharray: "48",
          strokeDashoffset: "48",
          animation: "$uncheckAnimation 200ms ease-out forwards"
        },
        "& line": {
          opacity: 0,
          stroke: colors.getContrastColorOf(
            !darkMode ? colors.primary.origin : colors.primary.light
          )
        }
      },
      indeterminated: {},
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
      },
      "@keyframes checkAnimation": {
        from: {
          strokeDashoffset: "48"
        },
        to: {
          strokeDashoffset: "0"
        }
      },
      "@keyframes uncheckAnimation": {
        from: {
          strokeDashoffset: "0"
        },
        to: {
          strokeDashoffset: "48"
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Checkbox = React.memo(
  React.forwardRef(function Checkbox(props, ref) {
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
      indeterminated = false,
      ...otherProps
    } = props;

    const {
      className: inputClassNameProp,
      id: inputId,
      ref: inputRefProp,
      onChange: inputOnChangeProp,
      onFocus: inputOnFocusProp,
      onBlur: inputOnBlurProp,
      name: inputNameProp,
      value: inputValueProp,
      readOnly: inputReadOnly = false,
      ...otherInputProps
    } = inputProps;

    const { className: labelClassName, ...otherLabelProps } = labelProps;

    const inputRef = useRef();
    const inputRefHandler = useForkRef(inputRef, inputRefProp);

    const localClass = useStyles();
    const checkGroup = useCheckGroup();
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

    const checkedState = checkGroup
      ? checkGroup.value.includes(value)
      : isChecked;

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
      name: checkGroup ? checkGroup.name : name,
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
            if (onChange) onChange(e, !checkedState);
            if (inputOnChangeProp) inputOnChangeProp(e, !checkedState);
            if (checkGroup && checkGroup.onChange) checkGroup.onChange(e);
            setChecked(!checkedState);
          }
        }
      }
    };

    const id = inputId
      ? inputId
      : controlProps.name && value
      ? `checkbox-${controlProps.name}-${value}`
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
          [localClass.checked]: checkedState,
          [localClass.indeterminated]: indeterminated
        })}
        {...otherProps}
      >
        <div className={localClass.cell}>
          <input
            id={id}
            name={controlProps.name}
            value={value}
            tabIndex={controlProps.disabled ? "-1" : "0"}
            disabled={controlProps.disabled}
            required={controlProps.required}
            className={createClass(localClass.input, inputClassNameProp)}
            onChange={controlProps.onChange}
            onFocus={controlProps.onFocus}
            onBlur={controlProps.onBlur}
            type="checkbox"
            checked={isChecked}
            ref={inputRefHandler}
            {...otherInputProps}
          />
          <div className={localClass.button}></div>
          <div className={localClass.checkIcon}>
            <svg aria-hidden="true" focusable="false">
              <polyline
                transform="translate(5.974874, 2.353553) rotate(-45.000000) translate(-5.974874, -2.353553) "
                points="2 0.292893219 2 4.29289322 9.94974747 4.41421356"
              ></polyline>
              <line
                x1="1.03268998"
                y1="4"
                x2="11.0000728"
                y2="4"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></line>
            </svg>
          </div>
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

Checkbox.displayName = componentName;

Checkbox.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  indeterminated: PropTypes.bool,
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

export default Checkbox;
