import c from "classnames";
import PropTypes from "prop-types";
import React from "react";
import ClipSpinner from "../Spinner/Clip";
import useTheme from "../styles/useTheme";
import type { AnyObject, MergeElementProps } from "../typings";
import {
  camelCase,
  getVar,
  useEventCallback,
  useForkedRefs,
  useIsFocusVisible
} from "../utils";
import useStyles, { type VariantColorCombo } from "./styles";

interface ButtonBaseProps {
  /**
   * The content of the button.
   */
  label?: string;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the button will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the button will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the button will have elavation.
   *
   * Note: You can only use the `raised={true}` property on `filled` buttons.`
   * @default false
   */
  raised?: boolean;
  /**
   * If `true`, the button will have a loading indicator.
   * @default false
   */
  loading?: boolean;
  /**
   * The size of the button.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The color of the button.
   * @default "default"
   */
  color?: "default" | "primary" | "secondary";
  /**
   * The variant of the button.
   * @default "filled"
   */
  variant?: "filled" | "outlined" | "inlined";
  /**
   * The leading icon element placed before the label.
   */
  leadingIcon?: React.ReactNode;
  /**
   * The trailing icon element placed before the label.
   */
  trailingIcon?: React.ReactNode;
  // eslint-disable-next-line no-unused-vars
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export type ButtonProps<T extends React.ElementType = "button"> =
  MergeElementProps<
    T,
    ButtonBaseProps & {
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      as?: T;
    }
  >;

type Component = {
  <T extends React.ElementType>(props: ButtonProps<T>): JSX.Element;
  propTypes?: React.WeakValidationMap<ButtonProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["filled", "inlined", "outlined"] as const;
const allowedSizes = ["large", "medium", "small"] as const;
const allowedColors = ["default", "primary", "secondary"] as const;

const ButtonBase = <T extends React.ElementType = "button">(
  props: ButtonProps<T>,
  ref: React.Ref<HTMLElement>
) => {
  const {
    label,
    className,
    leadingIcon,
    trailingIcon,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClick,
    as: RootNode = "button",
    size: sizeProp = "medium",
    color: colorProp = "default",
    variant: variantProp = "filled",
    rounded = false,
    disabled = false,
    raised = false,
    loading = false,
    ...otherProps
  } = props;

  const {
    darkMode,
    colors: { createPrimaryColor, createSecondaryColor, createBlackColor }
  } = useTheme();

  const classes = useStyles();

  const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

  const color = getVar(
    colorProp,
    "default",
    !allowedColors.includes(colorProp)
  );

  const variant = getVar(
    variantProp,
    "filled",
    !allowedVariants.includes(variantProp)
  );

  let invalidUsageOfRaised = false;

  if (raised && variantProp !== "filled") {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(
        [
          `Sonnat: You can not use the \`raised={true}\` and \`variant="${variant}"\` properties ` +
            "at the same time on `Button` component.",
          `We will fallback to \`raised={false}\` and \`variant="${variant}"\`.`
        ].join("\n")
      );
    }

    invalidUsageOfRaised = true;
  }

  const isNative = RootNode === "button";
  const isLink = RootNode === "a";

  const isLabeled = label != null;
  const isIconed = leadingIcon != null || trailingIcon != null;
  const isInvalid = !isLabeled && !isIconed;
  const isIconButton = !isInvalid && !isLabeled && isIconed;

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible<HTMLButtonElement>();

  const buttonRef = React.useRef<HTMLButtonElement>();

  const handleRef = useForkedRefs(ref, focusVisibleRef, buttonRef);

  const [focusVisible, setFocusVisible] = React.useState(false);

  if (disabled && focusVisible) {
    setFocusVisible(false);
  }

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusVisible]);

  const handleFocus = useEventCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!buttonRef.current) buttonRef.current = event.currentTarget;

      handleFocusVisible(event);

      if (isFocusVisibleRef.current === true) setFocusVisible(true);
      if (onFocus) (onFocus as React.FocusEventHandler)(event);
    }
  );

  const handleBlur = useEventCallback(
    (event: React.FocusEvent<HTMLButtonElement>) => {
      handleBlurVisible(event);

      if (isFocusVisibleRef.current === false) setFocusVisible(false);
      if (onBlur) (onBlur as React.FocusEventHandler)(event);
    }
  );

  const keyDownRef = React.useRef(false);

  const handleKeyDown = useEventCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (keyDownRef.current === false && focusVisible && event.key === " ") {
        keyDownRef.current = true;
      }

      if (
        event.target === event.currentTarget &&
        !isNative &&
        event.key === " "
      ) {
        event.preventDefault();
      }

      if (onKeyDown) (onKeyDown as React.KeyboardEventHandler)(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        !isNative &&
        !isLink &&
        event.key.toLowerCase() === "enter" &&
        !disabled
      ) {
        event.preventDefault();
        if (onClick)
          onClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    }
  );

  const handleKeyUp = useEventCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!event.defaultPrevented && focusVisible && event.key === " ") {
        keyDownRef.current = false;
      }

      if (onKeyUp) (onKeyUp as React.KeyboardEventHandler)(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        !isNative &&
        event.key === " " &&
        !event.defaultPrevented
      ) {
        if (onClick)
          onClick(event as unknown as React.MouseEvent<HTMLButtonElement>);
      }
    }
  );

  const conditionalProps: AnyObject = {};

  if (isNative) {
    conditionalProps.disabled = disabled;
  } else {
    conditionalProps["aria-disabled"] = disabled;
    conditionalProps.role = "button";
  }

  const iconComponents: Record<
    "leading" | "trailing" | "single",
    JSX.IntrinsicElements["i"] | null
  > = { leading: null, trailing: null, single: null };

  if (isIconButton) {
    const icon = leadingIcon || trailingIcon;
    iconComponents.single = (
      <i className={c(classes.leadingIcon, classes.icon)}>{icon}</i>
    );
  } else {
    if (leadingIcon != null) {
      iconComponents.leading = (
        <i className={c(classes.leadingIcon, classes.icon)}>{leadingIcon}</i>
      );
    }

    if (trailingIcon != null) {
      iconComponents.trailing = (
        <i className={c(classes.trailingIcon, classes.icon)}>{trailingIcon}</i>
      );
    }
  }

  const spinnerColor = {
    background:
      {
        filled: undefined,
        inlined: undefined,
        outlined: {
          default: undefined,
          primary: createPrimaryColor({ alpha: 0.12 }),
          secondary: createSecondaryColor({ alpha: 0.12 })
        }[color]
      }[variant] || (darkMode ? undefined : createBlackColor({ alpha: 0.12 })),
    foreground:
      {
        filled: undefined,
        inlined: undefined,
        outlined: {
          default: undefined,
          primary: createPrimaryColor({ alpha: 0.48 }),
          secondary: createSecondaryColor({ alpha: 0.48 })
        }[color]
      }[variant] || (darkMode ? undefined : createBlackColor({ alpha: 0.48 }))
  };

  return isInvalid ? null : (
    <RootNode
      type="button"
      tabIndex={disabled ? -1 : 0}
      ref={handleRef}
      onBlur={handleBlur}
      onFocus={handleFocus}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={c(
        className,
        classes.root,
        classes[variant],
        classes[size],
        classes[camelCase(`${variant}-${color}`) as VariantColorCombo],
        {
          [classes.loading]: loading,
          [classes.iconed]: isIconed,
          [classes.rounded]: rounded,
          [classes.focusVisible]: focusVisible,
          [classes.raised]: invalidUsageOfRaised ? false : raised,
          [classes.disabled]: loading || (!loading && disabled),
          [classes.iconButton]: isIconButton
        }
      )}
      {...conditionalProps}
      {...otherProps}
    >
      {loading && (
        <ClipSpinner
          backgroundColor={spinnerColor.background}
          foregroundColor={spinnerColor.foreground}
          className={c(classes.spinner)}
        />
      )}
      {iconComponents.leading}
      {!isIconButton ? (
        <span className={classes.label}>{label}</span>
      ) : (
        iconComponents.single
      )}
      {iconComponents.trailing}
    </RootNode>
  );
};

const Button = React.forwardRef(ButtonBase) as Component;

Button.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  raised: PropTypes.bool,
  loading: PropTypes.bool,
  color: PropTypes.oneOf(allowedColors),
  size: PropTypes.oneOf(allowedSizes),
  variant: PropTypes.oneOf(allowedVariants),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  as: PropTypes.elementType,
  leadingIcon: PropTypes.node,
  trailingIcon: PropTypes.node,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func
};

export default Button;
