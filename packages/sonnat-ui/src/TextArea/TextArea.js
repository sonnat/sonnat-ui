import clx from "classnames";
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import React from "react";
import useFormControl from "../FormControl/useFormControl";
import makeStyles from "../styles/makeStyles";
import { blue } from "../styles/pallete";
import {
  clamp,
  getVar,
  setRef,
  useControlled,
  useEnhancedEffect,
  useForkRef,
  useIsMounted
} from "../utils";

const componentName = "TextArea";

const allowedSizes = ["large", "medium", "small"];

/**
 * @type {(node: Node | null | undefined) => Document}
 */
const getOwnerDocument = node => (node && node.ownerDocument) || document;

/**
 * @type {(node: Node | null | undefined) => Window}
 */
const getOwnerWindow = node => getOwnerDocument(node).defaultView || window;

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
        "&:not($errored):not($focused):hover $wrapper:after": {
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.48 })
            : colors.createWhiteColor({ alpha: 0.48 })
        }
      },
      wrapper: {
        display: "inline-flex",
        position: "relative",
        minWidth: "0",
        verticalAlign: "top",
        flexDirection: "column",
        "&:after": {
          content: "''",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: 0,
          padding: 0,
          overflow: "hidden",
          position: "absolute",
          borderStyle: "solid",
          borderWidth: 1,
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.24 })
            : colors.createWhiteColor({ alpha: 0.24 }),
          borderRadius: pxToRem(4),
          pointerEvents: "none"
        }
      },
      shadow: {
        ...useText({ color: colors.text.primary }),
        visibility: "hidden",

        // Remove from the content flow
        position: "absolute",

        // Ignore the scrollbar width
        overflow: "hidden",

        border: "none",
        top: 0,
        left: 0,
        height: 0,
        padding: [[pxToRem(8), pxToRem(16)]],

        // Create a new layer, increase the isolation of the computed values
        transform: "translateZ(0)"
      },
      input: {
        ...useText({ color: colors.text.primary }),
        minWidth: 0,
        outline: "none",
        border: "none",
        backgroundColor: colors.transparent,
        resize: "none",
        padding: [[pxToRem(8), pxToRem(16)]],
        borderRadius: pxToRem(4),
        boxShadow: `0 0 0 0 ${colors.transparent}`,
        appearance: "none !important",
        "&::-webkit-input-placeholder": { color: colors.text.hint },
        "&::-moz-placeholder": { color: colors.text.hint },
        "&:-ms-input-placeholder": { color: colors.text.hint },
        "&:-moz-placeholder": { color: colors.text.hint }
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
      fluid: { width: "100%", "& $wrapper": { width: "100%" } },
      errored: {
        "& $wrapper:after": {
          borderColor: !darkMode ? colors.error.origin : colors.error.light
        },
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
      },
      readOnly: {
        pointerEvents: "none",
        "& $input": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 })
        }
      },
      disabled: {
        pointerEvents: "none",
        "& $wrapper:after": { borderColor: colors.divider },
        "& $input": {
          color: colors.text.disabled,
          "&::-webkit-input-placeholder": { color: colors.text.disabled },
          "&::-moz-placeholder": { color: colors.text.disabled },
          "&:-ms-input-placeholder": { color: colors.text.disabled },
          "&:-moz-placeholder": { color: colors.text.disabled }
        }
      },
      focused: {
        "&:not($errored) $wrapper:after": {
          borderWidth: 2,
          borderColor: !darkMode ? blue[500] : blue[300]
        },
        "&$errored $wrapper:after": {
          borderWidth: 2,
          borderColor: !darkMode ? colors.error.origin : colors.error.light
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
        "& $input, & $shadow": {
          padding: [[pxToRem(2), pxToRem(8)]],
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
        "& $input, & $shadow": {
          padding: [[pxToRem(6), pxToRem(8)]],
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
      resizable: { "& $input": { resize: "vertical" } }
    };
  },
  { name: `Sonnat${componentName}` }
);

const TextArea = React.forwardRef(function TextArea(props, ref) {
  const {
    placeholder,
    onBlur,
    onFocus,
    onChange,
    className,
    helperText,
    helperIcon,
    defaultValue,
    name: nameProp,
    value: valueProp,
    maxRows,
    minRows,
    style = {},
    inputProps = {},
    autoResize = false,
    autoFocus = false,
    focused = false,
    readOnly = false,
    fluid = false,
    hasError = false,
    disabled = false,
    resizable = false,
    required = false,
    size: sizeProp = "medium",
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
    style: inputStyleProp = {},
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
  const handleRef = useForkRef(ref, inputRef);
  const shadowRef = React.useRef();
  const renders = React.useRef(0);

  const [styleState, setStyleState] = React.useState({});

  const classes = useStyles();
  const formControl = useFormControl();

  const { current: _default_ } = React.useRef(
    inputValueProp || valueProp != null
      ? undefined
      : defaultValue != null
      ? defaultValue
      : ""
  );

  const [value, setValue, isControlled] = useControlled(
    inputValueProp || valueProp,
    _default_,
    componentName
  );

  const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

  const { current: initialValue } = React.useRef(value);

  const formControlFocusState = formControl
    ? formControl.focusedState
    : undefined;

  const { current: isAutoFocus } = React.useRef(
    typeof formControlFocusState === "undefined"
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

  let focusState =
    typeof formControlFocusState === "boolean"
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
        if (formControl && formControl.onFocus) formControl.onFocus(e);
        else setFocused(true);
      }
    },
    onBlur: e => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onBlur) onBlur(e);
        if (inputOnBlurProp) inputOnBlurProp(e);
        if (formControl && formControl.onBlur) formControl.onBlur(e);
        else setFocused(false);
      }
    },
    onChange: e => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        renders.current = 0;

        if (onChange) onChange(e, e.target.value);
        if (inputOnChangeProp) inputClassNameProp(e, e.target.value);
        if (!isControlled && autoResize) syncHeight();
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

  const syncHeight = React.useCallback(() => {
    const input = inputRef.current;
    const containerWindow = getOwnerWindow(input);
    const computedStyle = containerWindow.getComputedStyle(input);

    // If input's width is shrunk and it's not visible, don't sync height.
    if (computedStyle.width === "0px") return;

    const inputShadow = shadowRef.current;
    inputShadow.style.width = computedStyle.width;
    inputShadow.value = input.value || placeholder || "x";
    if (inputShadow.value.slice(-1) === "\n") {
      // Certain fonts which overflow the line height will cause the textarea
      // to report a different scrollHeight depending on whether the last line
      // is empty. Make it non-empty to avoid this issue.
      inputShadow.value += " ";
    }

    // The height of the inner content
    const innerHeight = inputShadow.scrollHeight;

    // Measure height of a textarea with a single row
    inputShadow.value = "x";
    const singleRowHeight = inputShadow.scrollHeight;

    // The height of the outer content
    let outerHeight = innerHeight;

    if (minRows)
      outerHeight = Math.max(Number(minRows) * singleRowHeight, outerHeight);
    if (maxRows)
      outerHeight = Math.min(Number(maxRows) * singleRowHeight, outerHeight);
    outerHeight = Math.max(outerHeight, singleRowHeight);

    const outerHeightStyle = outerHeight;
    const overflow = Math.abs(outerHeight - innerHeight) <= 1;

    setStyleState(prevState => {
      // Need a large enough difference to update the height.
      // This prevents infinite rendering loop.
      if (
        renders.current < 20 &&
        ((outerHeightStyle > 0 &&
          Math.abs((prevState.outerHeightStyle || 0) - outerHeightStyle) > 1) ||
          prevState.overflow !== overflow)
      ) {
        renders.current += 1;
        return {
          overflow,
          outerHeightStyle
        };
      }

      if (process.env.NODE_ENV !== "production") {
        if (renders.current === 20) {
          // eslint-disable-next-line no-console
          console.error(
            [
              "Sonnat: Too many re-renders. The layout is unstable.",
              "TextArea with `autoResize` prop, limits the number of renders to prevent an infinite loop."
            ].join("\n")
          );
        }
      }

      return prevState;
    });
  }, [maxRows, minRows, placeholder]);

  React.useEffect(() => {
    if (autoResize) {
      const handleResize = debounce(() => {
        renders.current = 0;
        syncHeight();
      }, 200);

      const containerWindow = getOwnerWindow(inputRef.current);
      containerWindow.addEventListener("resize", handleResize);

      return () => {
        handleResize.cancel();
        containerWindow.removeEventListener("resize", handleResize);
      };
    }
  }, [syncHeight, autoResize]);

  useEnhancedEffect(() => {
    if (autoResize) syncHeight();
  });

  React.useEffect(() => {
    renders.current = 0;
  }, [value]);

  return (
    <div
      className={clx(classes.root, className, classes[size], {
        [classes.resizable]: resizable,
        [classes.focused]: focusState,
        [classes.disabled]: controlProps.disabled,
        [classes.readOnly]: isReadOnly,
        [classes.fluid]: controlProps.fluid,
        [classes.errored]: controlProps.hasError
      })}
      ref={ref}
      {...otherProps}
    >
      <div className={classes.wrapper}>
        <textarea
          id={inputIdProp}
          name={name}
          placeholder={placeholder}
          value={finalValue}
          disabled={controlProps.disabled}
          required={controlProps.required}
          className={clx(classes.input, inputClassNameProp)}
          onChange={controlProps.onChange}
          onFocus={controlProps.onFocus}
          onBlur={controlProps.onBlur}
          readOnly={isReadOnly}
          rows={minRows}
          tabIndex={controlProps.disabled || isReadOnly ? -1 : 0}
          style={{
            height: styleState.outerHeightStyle,

            // Need a large enough difference to allow scrolling.
            // This prevents infinite rendering loop.
            overflow: styleState.overflow ? "hidden" : undefined,

            ...style,
            ...inputStyleProp
          }}
          ref={node => {
            if (inputRefProp) setRef(inputRefProp, node);
            handleRef(node);
          }}
          {...otherInputProps}
        />
        <textarea
          aria-hidden
          className={clx(classes.shadow, inputClassNameProp)}
          readOnly
          ref={shadowRef}
          tabIndex={-1}
          style={{
            ...style,
            ...inputStyleProp
          }}
        />
      </div>
      {(!!helperText || !!otherInputProps.maxLength) && (
        <div className={classes.helperRow}>
          {helperText && (
            <p className={classes.helperContent}>
              {helperIcon && <i className={classes.helperIcon}>{helperIcon}</i>}
              <span className={classes.helperText}>{helperText}</span>
            </p>
          )}
          {otherInputProps.maxLength && (
            <div className={classes.charCount}>
              {charCount} / {otherInputProps.maxLength}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = componentName;

TextArea.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  defaultValue: PropTypes.string,
  helperText: PropTypes.string,
  helperIcon: PropTypes.node,
  autoResize: PropTypes.bool,
  readOnly: PropTypes.bool,
  focused: PropTypes.bool,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  resizable: PropTypes.bool,
  required: PropTypes.bool,
  hasError: PropTypes.bool,
  fluid: PropTypes.bool,
  onFocus: PropTypes.func,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  inputProps: PropTypes.object,
  style: PropTypes.object,
  maxRows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minRows: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  size: PropTypes.oneOf(allowedSizes)
};

export default TextArea;
