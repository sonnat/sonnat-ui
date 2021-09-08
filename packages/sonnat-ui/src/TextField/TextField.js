import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import useFormControl from "../FormControl/useFormControl";
import SelectContext from "../Select/context";
import InputBase from "../InputBase";
import makeStyles from "../styles/makeStyles";
import {
  clamp,
  getVar,
  setRef,
  useControlled,
  useEnhancedEffect,
  useIsMounted
} from "../utils";
import TextFieldContext from "./context";

const componentName = "TextField";

const allowedVariants = ["filled", "outlined"];
const allowedSizes = ["large", "medium", "small"];
const allowedTypes = ["text", "email", "password"];

const isEmpty = value => value === undefined || value === null || value === "";

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
        height: pxToRem(40),
        appearance: "none !important",
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
        flex: [[1, 0]],
        "& + $charCount": {
          ...(direction === "rtl"
            ? { paddingRight: pxToRem(8) }
            : { paddingLeft: pxToRem(8) })
        }
      },
      helperText: {
        ...useText({
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          color: colors.text.secondary
        })
      },
      helperIcon: {
        ...useIconWrapper(16),
        marginTop: pxToRem(2),
        color: colors.text.secondary,
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) })
      },
      charCount: {
        ...useText({
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          color: colors.text.secondary
        }),
        ...(direction === "rtl"
          ? { marginRight: "auto" }
          : { marginLeft: "auto" }),
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
        "& $helperText": {
          fontSize: pxToRem(10),
          lineHeight: 1.8
        },
        "& $helperIcon": {
          ...useIconWrapper(14)
        },
        "& $input": {
          height: pxToRem(24),
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          "&::-webkit-input-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&::-moz-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&:-ms-input-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&:-moz-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          }
        }
      },
      medium: {
        "& $input": {
          height: pxToRem(32),
          fontSize: pxToRem(12),
          lineHeight: 1.6666666667,
          "&::-webkit-input-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&::-moz-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&:-ms-input-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          },
          "&:-moz-placeholder": {
            fontSize: pxToRem(12),
            lineHeight: 1.6666666667
          }
        }
      },
      large: {},
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

const TextField = React.memo(
  React.forwardRef(function TextField(props, ref) {
    const {
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
      variant: variantProp = "outlined",
      size: sizeProp = "medium",
      type: typeProp = "text",
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

    const inputRef = React.useRef();

    const classes = useStyles();
    const formControl = useFormControl();

    const selectContext = React.useContext(SelectContext);

    const isSelectDeepChild = !!selectContext;

    const { current: _default_ } = React.useRef(
      inputValueProp || valueProp != null
        ? undefined
        : defaultValue != null
        ? defaultValue
        : ""
    );

    const [value, setValue] = useControlled(
      inputValueProp || valueProp,
      _default_,
      componentName
    );

    const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

    const variant = getVar(
      variantProp,
      "outlined",
      !allowedVariants.includes(variantProp)
    );

    const type = getVar(typeProp, "text", !allowedTypes.includes(typeProp));

    const { current: initialValue } = React.useRef(value);

    const formControlFocusState = formControl
      ? formControl.focusedState
      : undefined;

    const { current: isAutoFocus } = React.useRef(
      isSelectDeepChild
        ? !!inputAutoFocusProp || autoFocus || focused
        : typeof formControlFocusState === "undefined"
        ? !!inputAutoFocusProp || autoFocus || focused
        : formControlFocusState
    );

    const isReadOnly = !!inputReadOnlyProp || readOnly;
    const hasLimitedLength = !!otherInputProps.maxLength;

    const isMounted = useIsMounted();

    const [isFocused, setFocused] = React.useState(isAutoFocus);

    const [charCount, setCharCount] = React.useState(
      clamp(
        initialValue.length,
        0,
        hasLimitedLength ? otherInputProps.maxLength : Infinity
      )
    );

    const finalValue = hasLimitedLength
      ? value.substr(0, otherInputProps.maxLength)
      : value;

    let focusState = isSelectDeepChild
      ? isFocused
      : typeof formControlFocusState === "boolean"
      ? formControlFocusState
      : isFocused;

    // inherit properties from FormControl
    const controlProps = {
      disabled: formControl ? formControl.disabled : disabled,
      hasError: formControl ? formControl.hasError : hasError,
      required: formControl ? formControl.required : required,
      fluid: formControl ? formControl.fluid : fluid,
      onFocus: e => {
        if (isMounted() && !(controlProps.disabled || isReadOnly)) {
          if (onFocus) onFocus(e);
          if (inputOnFocusProp) inputOnFocusProp(e);
          if (!isSelectDeepChild && formControl && formControl.onFocus)
            formControl.onFocus(e);
          setFocused(true);
        }
      },
      onBlur: e => {
        if (isMounted() && !(controlProps.disabled || isReadOnly)) {
          if (onBlur) onBlur(e);
          if (inputOnBlurProp) inputOnBlurProp(e);
          if (!isSelectDeepChild && formControl && formControl.onBlur)
            formControl.onBlur(e);
          setFocused(false);
        }
      },
      onChange: e => {
        if (isMounted() && !(controlProps.disabled || isReadOnly)) {
          if (onChange) onChange(e, e.target.value);
          if (inputOnChangeProp) inputOnChangeProp(e, e.target.value);
          setValue(e.target.value);
          setCharCount(e.target.value.length);
        }
      }
    };

    if (process.env.NODE_ENV !== "production") {
      if (controlProps.disabled && isReadOnly) {
        throw new Error(
          "[Sonnat]: You can't use `disabled` and `readOnly` props at the same time!"
        );
      }
    }

    if ((controlProps.disabled || isReadOnly) && focusState) {
      focusState = false;
    }

    // initially focus the component
    useEnhancedEffect(() => {
      if (!(controlProps.disabled || isReadOnly)) {
        if (isAutoFocus && inputRef.current) {
          inputRef.current.focus();
          setFocused(true);
        }
      }
    }, []);

    React.useImperativeHandle(ref, () => ({
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
          className={clx(classes.root, className, classes[size], {
            [classes.fluid]: controlProps.fluid,
            [classes.disabled]: controlProps.disabled,
            [classes.errored]: controlProps.hasError
          })}
          {...otherProps}
        >
          <InputBase
            focused={focusState}
            readOnly={isReadOnly}
            rounded={rounded}
            hasError={controlProps.hasError}
            disabled={controlProps.disabled}
            fluid={controlProps.fluid}
            size={size}
            variant={variant}
            leadingAdornment={leadingAdornment}
            trailingAdornment={trailingAdornment}
            className={clx(classes.base, {
              [classes.disabled]: controlProps.disabled,
              [classes.errored]: controlProps.hasError
            })}
            controller={
              <input
                id={inputIdProp}
                name={name}
                value={finalValue}
                placeholder={placeholder}
                readOnly={isReadOnly}
                disabled={controlProps.disabled}
                required={controlProps.required}
                className={clx(classes.input, inputClassNameProp)}
                ref={node => {
                  if (inputRefProp) setRef(inputRefProp, node);
                  setRef(inputRef, node);
                }}
                type={type}
                onFocus={controlProps.onFocus}
                onBlur={controlProps.onBlur}
                onChange={controlProps.onChange}
                tabIndex={controlProps.disabled || isReadOnly ? -1 : 0}
                {...otherInputProps}
              />
            }
          />
          {(!!helperText || !!otherInputProps.maxLength) && (
            <div className={classes.helperRow}>
              {helperText && (
                <p className={classes.helperContent}>
                  {helperIcon && (
                    <i className={classes.helperIcon}>{helperIcon}</i>
                  )}
                  <span className={classes.helperText}>{helperText}</span>
                </p>
              )}
              {hasLimitedLength && (
                <div className={classes.charCount}>
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
