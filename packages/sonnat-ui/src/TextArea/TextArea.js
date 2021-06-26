import createClass from "classnames";
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import React from "react";
import { useFormControl } from "../FormControl";
import { changeColor } from "../styles/colorUtils";
import makeStyles from "../styles/makeStyles";
import {
  clamp,
  setRef,
  useControlled,
  useEnhancedEffect,
  useForkRef
} from "../utils";

const componentName = "TextArea";

/**
 * @type {(node: Node | null | undefined) => Document}
 */
const getOwnerDocument = node => (node && node.ownerDocument) || document;

/**
 * @type {(node: Node | null | undefined) => Window}
 */
const getOwnerWindow = node => getOwnerDocument(node).defaultView || window;

/**
 * @type {(style: React.CSSProperties, property: string) => number}
 */
const getStyleNumericValue = (style, property) =>
  parseInt(style[property], 10) || 0;

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
        minWidth: "0",
        verticalAlign: "top",
        flexDirection: "column",
        "&:not($errored):not($focused) $input:hover": {
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.48 })
            : colors.createWhiteColor({ alpha: 0.48 })
        }
      },
      shadow: {
        ...useText({ color: colors.text.primary, lineHeight: 1.5 }),
        visibility: "hidden",

        // Remove from the content flow
        position: "absolute",

        // Ignore the scrollbar width
        overflow: "hidden",

        border: "none",
        top: 0,
        left: 0,
        height: 0,

        // Create a new layer, increase the isolation of the computed values
        transform: "translateZ(0)"
      },
      input: {
        ...useText({ color: colors.text.primary, lineHeight: 1.5 }),
        // flex: [[1, 1]],
        minWidth: 0,
        // minHeight: pxToRem(120),
        borderRadius: pxToRem(4),
        outline: "none",
        border: `${pxToRem(1)} solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.24 })
            : colors.createWhiteColor({ alpha: 0.24 })
        }`,
        backgroundColor: colors.transparent,
        resize: "none",
        padding: [[pxToRem(8), pxToRem(16)]],
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
        flex: [[1, 0]]
      },
      helperText: {
        ...useText({
          fontSize: pxToRem(12),
          color: colors.text.secondary
        })
      },
      helperIcon: {
        ...useIconWrapper(16),
        marginTop: pxToRem(4),
        color: colors.text.secondary,
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) })
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
      fluid: { width: "100%" },
      errored: {
        "& $input": {
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
        "& $input": {
          borderColor: colors.divider,
          color: colors.text.disabled,
          "&::-webkit-input-placeholder": { color: colors.text.disabled },
          "&::-moz-placeholder": { color: colors.text.disabled },
          "&:-ms-input-placeholder": { color: colors.text.disabled },
          "&:-moz-placeholder": { color: colors.text.disabled }
        }
      },
      focused: {
        "&:not($errored) $input": {
          borderColor: !darkMode
            ? colors.createPrimaryColor({ alpha: 0.56 })
            : changeColor(colors.primary.light, { alpha: 0.56 }),
          boxShadow: `0 0 0 ${pxToRem(1)} ${
            !darkMode
              ? colors.createPrimaryColor({ alpha: 0.56 })
              : changeColor(colors.primary.light, { alpha: 0.56 })
          }`
        },
        "&$errored $input": {
          boxShadow: `0 0 0 ${pxToRem(1)} ${
            !darkMode ? colors.error.origin : colors.error.light
          }`
        }
      },
      resizable: { "& $input": { resize: "vertical" } }
    };
  },
  { name: `Sonnat${componentName}` }
);

const TextArea = React.memo(
  React.forwardRef(function TextArea(props, ref) {
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

    const [state, setState] = React.useState({});

    const localClass = useStyles();
    const formControl = useFormControl();

    const [value, setValue, isControlled] = useControlled(
      inputValueProp || valueProp,
      defaultValue,
      componentName
    );

    const isInit = React.useRef(true);
    const { current: initialValue } = React.useRef(
      inputValueProp || valueProp || defaultValue
    );

    const isReadOnly = !!inputReadOnlyProp || readOnly;
    const isAutoFocus = !!inputAutoFocusProp || autoFocus || focused;
    const hasLimitedLength = !!otherInputProps.maxLength;

    const [isMounted, setMounted] = React.useState(false);
    const [isFocused, setFocused] = React.useState(isAutoFocus);
    const [charCount, setCharCount] = React.useState(
      clamp(
        initialValue ? initialValue.length : 0,
        0,
        hasLimitedLength ? otherInputProps.maxLength : Infinity
      )
    );

    // inherit properties from FormControl
    const controlProps = {
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
            renders.current = 0;

            if (onChange) onChange(e, e.target.value);
            if (inputOnChangeProp) inputClassNameProp(e, e.target.value);
            if (!isControlled && autoResize) syncHeight();
            setValue(e.target.value);
            setCharCount(e.target.value.length);
          }
        }
      }
    };

    // prevent component from being focused if it is disabled or readOnly
    controlProps.focused =
      controlProps.disabled || isReadOnly ? false : controlProps.focused;

    React.useEffect(() => {
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

      const boxSizing = computedStyle["box-sizing"];
      const padding =
        getStyleNumericValue(computedStyle, "padding-bottom") +
        getStyleNumericValue(computedStyle, "padding-top");
      const border =
        getStyleNumericValue(computedStyle, "border-bottom-width") +
        getStyleNumericValue(computedStyle, "border-top-width");

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

      // Take the box sizing into account for applying this value as a style.
      const outerHeightStyle =
        outerHeight + (boxSizing === "border-box" ? padding + border : 0);
      const overflow = Math.abs(outerHeight - innerHeight) <= 1;

      setState(prevState => {
        // Need a large enough difference to update the height.
        // This prevents infinite rendering loop.
        if (
          renders.current < 20 &&
          ((outerHeightStyle > 0 &&
            Math.abs((prevState.outerHeightStyle || 0) - outerHeightStyle) >
              1) ||
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
        className={createClass(localClass.root, className, {
          [localClass.resizable]: resizable,
          [localClass.focused]: controlProps.focused,
          [localClass.disabled]: controlProps.disabled,
          [localClass.readOnly]: isReadOnly,
          [localClass.fluid]: controlProps.fluid,
          [localClass.errored]: controlProps.hasError
        })}
        ref={ref}
        {...otherProps}
      >
        <textarea
          id={inputIdProp}
          name={name}
          placeholder={placeholder}
          value={value}
          disabled={controlProps.disabled}
          required={controlProps.required}
          className={createClass(localClass.input, inputClassNameProp)}
          onChange={controlProps.onChange}
          onFocus={controlProps.onFocus}
          onBlur={controlProps.onBlur}
          readOnly={isReadOnly}
          rows={minRows}
          style={{
            height: state.outerHeightStyle,

            // Need a large enough difference to allow scrolling.
            // This prevents infinite rendering loop.
            overflow: state.overflow ? "hidden" : undefined,

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
          className={createClass(localClass.shadow, inputClassNameProp)}
          readOnly
          ref={shadowRef}
          tabIndex={-1}
          style={{
            ...style,
            ...inputStyleProp,
            padding: 0
          }}
        />
        {(!!helperText || !!otherInputProps.maxLength) && (
          <div className={localClass.helperRow}>
            {helperText && (
              <p className={localClass.helperContent}>
                {helperIcon && (
                  <i className={localClass.helperIcon}>{helperIcon}</i>
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
    );
  })
);

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
  minRows: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default TextArea;
