import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import useCheckGroup from "../CheckGroup/useCheckGroup";
import useFormControl from "../FormControl/useFormControl";
import { changeColor } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";
import getVar from "../utils/getVar";
import useControlled from "../utils/useControlled";
import useEnhancedEffect from "../utils/useEnhancedEffect";
import useEventCallback from "../utils/useEventCallback";
import useForkRef from "../utils/useForkRef";
import useIsFocusVisible from "../utils/useIsFocusVisible";
import useIsMounted from "../utils/useIsMounted";

const componentName = "Checkbox";

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
        outline: "none"
      },
      label: useText({ color: colors.text.primary }),
      cell: {
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
        borderRadius: pxToRem(2),
        overflow: "hidden",
        transition:
          "border-color 90ms cubic-bezier(0, 0, 0.2, 1), background-color 90ms cubic-bezier(0, 0, 0.2, 1)"
      },
      checkIcon: {
        position: "absolute",
        pointerEvents: "none",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        justifyContent: "center",
        transition: "transform 400ms ease",
        "& svg": { width: pxToRem(12), height: pxToRem(8) },
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
      indeterminated: {
        "&:not($checked):not($disabled)": {
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
        "&:not($checked)$disabled": {
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
        "& $button": {
          borderColor: !darkMode ? colors.primary.origin : colors.primary.light,
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
      checkedDisabled: {
        "& $button": {
          pointerEvents: "none",
          borderColor: colors.transparent,
          backgroundColor: colors.divider
        }
      },
      checkedFocused: {
        "& $cell:before": {
          backgroundColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.12 })
            : changeColor(colors.primary.light, { alpha: 0.12 })
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
      },
      large: {
        "& $cell": {
          width: pxToRem(36),
          height: pxToRem(36),
          minWidth: pxToRem(36),
          minHeight: pxToRem(36)
        },
        "& $label": { fontSize: pxToRem(16), lineHeight: 1.625 },
        "& $button": { width: pxToRem(18), height: pxToRem(18) },
        "& $checkIcon": {
          width: pxToRem(18),
          height: pxToRem(18)
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
        "& $button": { width: pxToRem(16), height: pxToRem(16) },
        "& $checkIcon": {
          width: pxToRem(16),
          height: pxToRem(16)
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
        "& $button": { width: pxToRem(14), height: pxToRem(14) },
        "& $checkIcon": {
          width: pxToRem(14),
          height: pxToRem(14)
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
      onKeyDown,
      onKeyUp,
      label,
      id: idProp,
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
      indeterminated = false,
      autoFocus: autoFocusProp = false,
      size: sizeProp = "medium",
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
      autoFocus: inputAutoFocus = false,
      readOnly: inputReadOnly = false,
      checked: inputCheckedProp,
      defaultChecked: inputDefaultChecked,
      ...otherInputProps
    } = inputProps;

    const { className: labelClassName, ...otherLabelProps } = labelProps;

    const { current: defaultChecked } = React.useRef(
      checkedProp != null
        ? undefined
        : defaultCheckedProp != null
        ? defaultCheckedProp
        : false
    );

    const inputRef = React.useRef(null);
    const inputRefHandler = useForkRef(inputRef, inputRefProp);

    const classes = useStyles();
    const checkGroup = useCheckGroup();
    const formControl = useFormControl();

    const [checked, setChecked] = useControlled(
      checkedProp,
      defaultChecked,
      componentName
    );

    const isMounted = useIsMounted();

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

    const isFormControlFocused = formControl
      ? !!formControl.focusedState
      : false;

    const autoFocus = isFormControlFocused || !!inputAutoFocus || autoFocusProp;

    const name = inputNameProp || nameProp;
    const value = inputValueProp || valueProp;

    const checkedState = checkGroup
      ? checkGroup.value.includes(value)
      : checked;

    const controlProps = {
      name: checkGroup ? checkGroup.name : name,
      disabled: formControl ? formControl.disabled : disabled,
      hasError: formControl ? formControl.hasError : hasError,
      required: formControl ? formControl.required : required,
      onFocus: e => {
        if (isMounted()) {
          if (!(controlProps.disabled || isReadOnly)) {
            if (onFocus) onFocus(e);
            if (inputOnFocusProp) inputOnFocusProp(e);
            if (formControl && formControl.onFocus) formControl.onFocus(e);
          }
        }
      },
      onBlur: e => {
        if (isMounted()) {
          if (!(controlProps.disabled || isReadOnly)) {
            if (onBlur) onBlur(e);
            if (inputOnBlurProp) inputOnBlurProp(e);
            if (formControl && formControl.onBlur) formControl.onBlur(e);
          }
        }
      },
      onChange: e => {
        if (isMounted()) {
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
      : idProp
      ? `checkbox-${idProp}`
      : undefined;

    const {
      isFocusVisibleRef,
      onBlur: handleBlurVisible,
      onFocus: handleFocusVisible,
      ref: focusVisibleRef
    } = useIsFocusVisible();

    const rootRef = React.useRef(null);

    const handleOwnRef = useForkRef(focusVisibleRef, rootRef);
    const handleRef = useForkRef(ref, handleOwnRef);

    const [isFocused, setFocused] = React.useState(autoFocus);

    // prevent component from being focused if it is disabled
    React.useEffect(() => {
      if (controlProps.disabled && isFocused) {
        setFocused(false);
      }
    }, [controlProps.disabled, isFocused]);

    // initially focus the component
    useEnhancedEffect(() => {
      if (!(controlProps.disabled || isReadOnly)) {
        if (autoFocus && rootRef.current) rootRef.current.focus();
      }
    }, [autoFocus]);

    React.useEffect(() => {
      isFocusVisibleRef.current = isFocused;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    const handleFocus = useEventCallback(event => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!rootRef.current) rootRef.current = event.currentTarget;

      handleFocusVisible(event);

      if (isFocusVisibleRef.current === true) setFocused(true);
      controlProps.onFocus(event);
    });

    const handleBlur = useEventCallback(event => {
      handleBlurVisible(event);

      if (isFocusVisibleRef.current === false) setFocused(false);
      controlProps.onBlur(event);
    });

    const keyDownRef = React.useRef(false);

    const handleKeyDown = useEventCallback(event => {
      if (keyDownRef.current === false && isFocused && event.key === " ") {
        keyDownRef.current = true;
      }

      if (event.target === event.currentTarget && event.key === " ") {
        event.preventDefault();
      }

      if (onKeyDown) onKeyDown(event);
    });

    const handleKeyUp = useEventCallback(event => {
      if (!event.defaultPrevented && isFocused && event.key === " ") {
        keyDownRef.current = false;
      }

      if (onKeyUp) onKeyUp(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        event.key === " " &&
        !event.defaultPrevented
      ) {
        controlProps.onChange(event);
      }
    });

    return (
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={controlProps.disabled}
        ref={handleRef}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={clx(classes.root, className, classes[size], {
          [classes.disabled]: controlProps.disabled,
          [classes.focused]: isFocused,
          [classes.checked]: checkedState,
          [classes.checkedDisabled]: checkedState && controlProps.disabled,
          [classes.checkedFocused]: checkedState && isFocused,
          [classes.indeterminated]: indeterminated
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
            className={clx(classes.input, inputClassNameProp)}
            onChange={controlProps.onChange}
            type="checkbox"
            checked={checkedState}
            ref={inputRefHandler}
            {...otherInputProps}
          />
          <div className={classes.button}></div>
          <div className={classes.checkIcon}>
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

Checkbox.displayName = componentName;

Checkbox.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  autoFocus: PropTypes.bool,
  indeterminated: PropTypes.bool,
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

export default Checkbox;
