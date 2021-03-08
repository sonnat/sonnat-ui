import React, { useState, useRef, useEffect, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import useFormControl from "../FormControl/useFormControl";
import TextFieldContext from "./context";
import InputBase from "../InputBase";
import makeStyles from "../styles/makeStyles";
import { clamp, setRef, useControlled, useEnhancedEffect } from "../utils";

const componentName = "TextField";
const allowedVariants = ["filled", "outlined"];
const allowedSizes = ["medium", "small"];
const allowedTypes = ["text", "email", "password"];

const isEmpty = value => value === undefined || value === null || value === "";

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
        display: "inline-flex",
        position: "relative",
        flexDirection: "column"
      },
      base: { cursor: "text" },
      input: {
        ...useText({ color: colors.text.primary }),
        border: "none",
        outline: "none",
        padding: 0,
        margin: 0,
        flex: [[1, 1]],
        minWidth: 0,
        height: "100%",
        WebkitAppearance: "none",
        MozAppearance: "none",
        appearance: "none",
        backgroundColor: colors.transparent,
        "&::-webkit-input-placeholder": useText({
          color: colors.text.hint
        }),
        "&::-moz-placeholder": useText({ color: colors.text.hint }),
        "&:-ms-input-placeholder": useText({ color: colors.text.hint }),
        "&:-moz-placeholder": useText({ color: colors.text.hint })
      },
      helperRow: {
        display: "flex",
        marginTop: pxToRem(4),
        padding: [[0, pxToRem(8)]]
      },
      helperContent: {
        display: "flex",
        margin: 0,
        flex: [[1, 0]]
      },
      helperText: {
        ...useText({
          fontSize: pxToRem(12),
          color: colors.text.secondary
        })
      },
      helperIconWrapper: {
        paddingTop: pxToRem(4),
        ...(direction === "rtl"
          ? { paddingLeft: pxToRem(4) }
          : { paddingRight: pxToRem(4) })
      },
      helperIcon: {
        color: colors.text.secondary,
        width: pxToRem(16),
        height: pxToRem(16),
        maxWidth: pxToRem(16),
        maxHeight: pxToRem(16),
        fontSize: pxToRem(16)
      },
      charCount: {
        ...useText({
          fontSize: pxToRem(12),
          color: colors.text.secondary
        }),
        ...(direction === "rtl"
          ? { marginRight: pxToRem(8) }
          : { marginLeft: pxToRem(8) }),
        minWidth: "7.7ch",
        display: "flex",
        justifyContent: "flex-end",
        flexShrink: 0
      },
      disabled: {
        pointerEvents: "none",
        "& $input": {
          color: colors.text.disabled,
          "&::-webkit-input-placeholder": { color: colors.text.disabled },
          "&::-moz-placeholder": { color: colors.text.disabled },
          "&:-ms-input-placeholder": { color: colors.text.disabled },
          "&:-moz-placeholder": { color: colors.text.disabled }
        }
      },
      small: {
        "& $input": {
          fontSize: pxToRem(12),
          "&::-webkit-input-placeholder": { fontSize: pxToRem(12) },
          "&::-moz-placeholder": { fontSize: pxToRem(12) },
          "&:-ms-input-placeholder": { fontSize: pxToRem(12) },
          "&:-moz-placeholder": { fontSize: pxToRem(12) }
        }
      },
      medium: {},
      fluid: { width: "100%" },
      errored: {
        "&:not($disabled)": {
          "& $charCount": {
            color: !darkMode ? colors.error.origin : colors.error.light
          },
          "& $helperText": {
            color: !darkMode ? colors.error.origin : colors.error.light
          },
          "& $helperIcon": {
            color: !darkMode ? colors.error.origin : colors.error.light
          }
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const createHelperIcon = (helperIcon, className) =>
  React.cloneElement(helperIcon, {
    className: createClass(className, helperIcon.props.className)
  });

const TextField = React.memo(
  React.forwardRef(function TextField(props, ref) {
    const {
      legendLabel,
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
      name: nameProp,
      value: valueProp,
      variant = "outlined",
      size = "medium",
      type = "text",
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
      value: inputValueProp,
      onFocus: inputOnFocusProp,
      onBlur: inputOnBlurProp,
      onChange: inputOnChangeProp,
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

    const inputRef = useRef();

    const localClass = useStyles();
    const formControl = useFormControl();

    const [value, setValue, isControlled] = useControlled(
      inputValueProp || valueProp,
      defaultValue,
      componentName
    );

    const isInit = useRef(true);
    const { current: initialValue } = useRef(
      inputValueProp || valueProp || defaultValue
    );

    const isLegendLabeled = !!legendLabel;
    const isReadOnly = !!inputReadOnlyProp || readOnly;
    const isAutoFocus = !!inputAutoFocusProp || autoFocus || focused;
    const hasLeadingAdornment = !!leadingAdornment;
    const hasLimitedLength = !!otherInputProps.maxLength;

    const [isMounted, setMounted] = useState(false);
    const [isFocused, setFocused] = useState(isAutoFocus);
    const [charCount, setCharCount] = useState(
      clamp(
        initialValue ? initialValue.length : 0,
        0,
        hasLimitedLength ? otherInputProps.maxLength : Infinity
      )
    );

    // inherit properties from FormControl
    const controlProps = {
      size: formControl ? formControl.size : size,
      focused: formControl ? formControl.focusedState : isFocused,
      disabled: formControl ? formControl.disabled : disabled,
      hasError: formControl ? formControl.hasError : hasError,
      required: formControl ? formControl.required : required,
      fluid: formControl ? formControl.fluid : fluid,
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
            if (onChange) onChange(e, e.target.value);
            if (inputOnChangeProp) inputOnChangeProp(e, e.target.value);
            setValue(e.target.value);
            setCharCount(e.target.value.length);
          }
        }
      }
    };

    // prevent component from being focused if it is disabled or readOnly
    controlProps.focused =
      controlProps.disabled || isReadOnly ? false : controlProps.focused;

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    // initially focus the component if it is focused
    useEnhancedEffect(() => {
      if (
        isInit.current &&
        isMounted &&
        !(controlProps.disabled || isReadOnly)
      ) {
        if (isAutoFocus || controlProps.focused) {
          if (inputRef.current) {
            inputRef.current.focus();
            isInit.current = false;
          }
        }
      }
    });

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRef.current.focus();
      },
      blur: () => {
        inputRef.current.blur();
      },
      clear: () => {
        if (value !== "") {
          if (!(controlProps.disabled || isReadOnly)) {
            if (onChange) onChange(undefined, "");
            if (inputOnChangeProp) inputOnChangeProp(undefined, "");
            inputRef.current.value = "";
            setValue("");
            setCharCount(0);
          }
        }
      }
    }));

    return (
      <TextFieldContext.Provider value={{ isEmpty: isEmpty(value) }}>
        <div
          ref={ref}
          className={createClass(localClass.root, className, {
            [localClass.fluid]: fluid,
            [localClass[controlProps.size]]: allowedSizes.includes(
              controlProps.size
            )
          })}
          {...otherProps}
        >
          <InputBase
            legendLabel={legendLabel}
            focused={controlProps.focused}
            readOnly={isReadOnly}
            rounded={rounded}
            hasError={controlProps.hasError}
            disabled={controlProps.disabled}
            fluid={controlProps.fluid}
            size={controlProps.size}
            variant={variant}
            leadingAdornment={leadingAdornment}
            trailingAdornment={trailingAdornment}
            className={createClass(localClass.base, {
              [localClass.disabled]: controlProps.disabled,
              [localClass.errored]: controlProps.hasError
            })}
            controller={
              <input
                id={inputIdProp}
                name={name}
                value={
                  isControlled
                    ? hasLimitedLength
                      ? value
                        ? value.substr(0, otherInputProps.maxLength)
                        : undefined
                      : value
                    : undefined
                }
                defaultValue={
                  hasLimitedLength
                    ? defaultValue
                      ? defaultValue.substr(0, otherInputProps.maxLength)
                      : undefined
                    : defaultValue
                }
                placeholder={
                  isLegendLabeled
                    ? hasLeadingAdornment
                      ? placeholder
                      : undefined
                    : placeholder
                }
                readOnly={isReadOnly}
                disabled={controlProps.disabled}
                required={controlProps.required}
                className={createClass(localClass.input, inputClassNameProp)}
                ref={node => {
                  if (inputRefProp) setRef(inputRefProp, node);
                  setRef(inputRef, node);
                }}
                type={type}
                onFocus={controlProps.onFocus}
                onBlur={controlProps.onBlur}
                onChange={controlProps.onChange}
                {...otherInputProps}
              />
            }
            controllerId={inputIdProp}
          />
          {(!!helperText || !!otherInputProps.maxLength) && (
            <div className={localClass.helperRow}>
              {helperText && (
                <p className={localClass.helperContent}>
                  {helperIcon && (
                    <span className={localClass.helperIconWrapper}>
                      {createHelperIcon(helperIcon, localClass.helperIcon)}
                    </span>
                  )}
                  <span className={localClass.helperText}>{helperText}</span>
                </p>
              )}
              {otherInputProps.maxLength && (
                <div className={localClass.charCount}>
                  {charCount} / {otherInputProps.maxLength}
                </div>
              )}
            </div>
          )}
        </div>
      </TextFieldContext.Provider>
    );
  })
);

TextField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  legendLabel: PropTypes.string,
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

TextField.displayName = componentName;

export default TextField;
