/* eslint-disable @typescript-eslint/no-non-null-assertion */
import c from "classnames";
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import * as React from "react";
import useFormControl from "../FormControl/useFormControl";
import type { MergeElementProps } from "../typings";
import {
  clamp,
  getVar,
  setRef,
  useControlledProp,
  useId,
  useIsMounted,
  useIsomorphicLayoutEffect
} from "../utils";
import useStyles from "./styles";

interface TextAreaBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The name of the textarea. */
  name?: string;
  /** The `placeholder` property of the textarea. */
  placeholder?: string;
  /**
   * The value of the textarea. The DOM API casts this to a string.
   */
  value?: string;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: string;
  /** The helper text content. */
  helperText?: string;
  /** The helper icon element placed before the helper text. */
  helperIcon?: React.ReactNode;
  /**
   * Maximum number of rows to display.
   */
  maxRows?: number;
  /**
   * Minimum number of rows to display.
   */
  minRows?: number;
  /**
   * If `true`, the textarea will automatically adjust the height.
   * @default false
   */
  autoResize?: boolean;
  /**
   * If `true`, the textarea will be vertically resizable.
   * @default false
   */
  resizable?: boolean;
  /**
   * If `true`, the textarea will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the textarea will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * If `true`, the textarea will be focused on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the textarea will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the textarea will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the textarea will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the textarea will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * The size of the textarea.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /** The properties applied to the `input` element. */
  inputProps?: Omit<
    React.ComponentPropsWithRef<"textarea">,
    | "value"
    | "checked"
    | "defaultChecked"
    | "defaultValue"
    | "onChange"
    | "onBlur"
    | "onFocus"
  >;
  /**
   * The Callback fires when the state has changed.
   */
  onChange?: (value: string) => void;
  /**
   * The Callback fires when the textarea has received focus.
   */
  onFocus?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  /**
   * The Callback fires when the textarea has lost focus.
   */
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
}

export type TextAreaProps = Omit<
  MergeElementProps<"div", TextAreaBaseProps>,
  "defaultChecked"
>;

type Component = {
  (props: TextAreaProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TextAreaProps> | undefined;
  displayName?: string | undefined;
};

const allowedSizes = ["large", "medium", "small"] as const;

const getOwnerDocument = (node?: Node | null) =>
  (node && node.ownerDocument) || document;

const getOwnerWindow = (node?: Node | null) =>
  getOwnerDocument(node).defaultView || window;

const getStyleValue = (
  computedStyle: CSSStyleDeclaration,
  property: keyof CSSStyleDeclaration
) => {
  const style = computedStyle[property] as string | null | undefined;

  if (!style) return 0;
  return parseInt(style, 10);
};

const TextAreaBase = (props: TextAreaProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    placeholder,
    onBlur,
    onFocus,
    onChange,
    className,
    helperText,
    helperIcon,
    defaultValue,
    id: idProp,
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

  const name = inputNameProp || nameProp;

  const inputRef = React.useRef<HTMLTextAreaElement>();
  const shadowRef = React.useRef<HTMLTextAreaElement>(null);

  const renders = React.useRef(0);

  const [styleState, setStyleState] = React.useState<{
    overflow?: boolean;
    outerHeightStyle?: number;
  }>({});

  const classes = useStyles();
  const formControl = useFormControl();

  const [value, setValue, isControlled] = useControlledProp(
    valueProp,
    defaultValue,
    ""
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
      hasLimitedLength ? otherInputProps.maxLength! : Infinity
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
    onFocus: (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onFocus) onFocus(e);
        if (formControl && formControl.onFocus) formControl.onFocus();
        else setFocused(true);
      }
    },
    onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        if (onBlur) onBlur(e);
        if (formControl && formControl.onBlur) formControl.onBlur();
        else setFocused(false);
      }
    },
    onChange: (e: React.FocusEvent<HTMLTextAreaElement>) => {
      if (isMounted() && !(controlProps.disabled || isReadOnly)) {
        renders.current = 0;

        if (onChange) onChange(e.target.value);
        if (!isControlled && autoResize) syncHeight();
        setValue(e.target.value);
        setCharCount(e.target.value.length);
      }
    }
  };

  const id = useId(inputIdProp || idProp, "TEXTAREA");

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
  useIsomorphicLayoutEffect(() => {
    if (!(controlProps.disabled || isReadOnly)) {
      if (isAutoFocus && inputRef.current) {
        inputRef.current.focus();
        setFocused(true);
      }
    }
  }, []);

  const syncHeight = React.useCallback(() => {
    const input = inputRef.current;

    if (!input) return;

    const containerWindow = getOwnerWindow(input);
    const computedStyle = containerWindow.getComputedStyle(input);

    // If input's width is shrunk and it's not visible, don't sync height.
    if (computedStyle.width === "0px") return;

    const inputShadow = shadowRef.current;

    if (!inputShadow) return;

    inputShadow.style.width = computedStyle.width;
    inputShadow.value = input.value || placeholder || " ";
    if (inputShadow.value.slice(-1) === "\n") {
      // Certain fonts which overflow the line height will cause the textarea
      // to report a different scrollHeight depending on whether the last line
      // is empty. Make it non-empty to avoid this issue.
      inputShadow.value += " ";
    }

    const boxSizing = computedStyle.boxSizing;

    const padding =
      getStyleValue(computedStyle, "paddingBottom") +
      getStyleValue(computedStyle, "paddingTop");

    const border =
      getStyleValue(computedStyle, "borderBottomWidth") +
      getStyleValue(computedStyle, "borderTopWidth");

    // The height of the inner content
    const innerHeight = inputShadow.scrollHeight;

    // Measure height of a textarea with a single row
    inputShadow.value = " ";
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

  useIsomorphicLayoutEffect(() => void (autoResize && syncHeight()));
  React.useEffect(() => void (renders.current = 0), [value]);

  return (
    <div
      id={idProp}
      className={c(classes.root, className, classes[size], {
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
          aria-describedby={helperText && `${String(id)}-describer`}
          id={id}
          name={name}
          placeholder={placeholder}
          value={finalValue}
          disabled={controlProps.disabled}
          required={controlProps.required}
          className={c(classes.input, inputClassNameProp)}
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
            setRef(inputRef, node);
          }}
          {...otherInputProps}
        />
        <textarea
          aria-hidden
          readOnly
          className={c(classes.shadow, inputClassNameProp)}
          ref={shadowRef}
          tabIndex={-1}
          style={{ ...style, ...inputStyleProp }}
        />
      </div>
      {(!!helperText || !!otherInputProps.maxLength) && (
        <div className={classes.helperRow}>
          {helperText && (
            <p id={`${String(id)}-describer`} className={classes.helperContent}>
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
};

const TextArea = React.forwardRef(TextAreaBase) as Component;

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
  maxRows: PropTypes.number,
  minRows: PropTypes.number,
  size: PropTypes.oneOf(allowedSizes)
};

export default TextArea;
