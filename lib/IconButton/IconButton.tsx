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
import useStyles, { VariantColorCombo } from "./styles";

interface BaseProps {
  /**
   * The icon element.
   */
  icon: React.ReactNode;
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
  // eslint-disable-next-line no-unused-vars
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export type IconButtonProps<T extends React.ElementType = "button"> =
  MergeElementProps<
    T,
    BaseProps & {
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      as?: T;
    }
  >;

type Component = {
  <T extends React.ElementType = "button">(
    props: IconButtonProps<T>
  ): JSX.Element;
  propTypes?: React.WeakValidationMap<IconButtonProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["filled", "inlined", "outlined"] as const;
const allowedSizes = ["large", "medium", "small"] as const;
const allowedColors = ["default", "primary", "secondary"] as const;

const IconButtonBase = <T extends React.ElementType = "button">(
  props: IconButtonProps<T>,
  ref: React.Ref<HTMLElement>
) => {
  const {
    className,
    icon,
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
            "at the same time on `IconButton` component.",
          `We will fallback to \`raised={false}\` and \`variant="${variant}"\`.`
        ].join("\n")
      );
    }

    invalidUsageOfRaised = true;
  }

  const isNative = RootNode === "button";
  const isLink = RootNode === "a";

  const isInvalid = icon == null;

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
        classes.iconed,
        classes.iconButton,
        classes[variant],
        classes[size],
        classes[camelCase(`${variant}-${color}`) as VariantColorCombo],
        {
          [classes.loading]: loading,
          [classes.rounded]: rounded,
          [classes.focusVisible]: focusVisible,
          [classes.raised]: invalidUsageOfRaised ? false : raised,
          [classes.disabled]: loading || (!loading && disabled)
        }
      )}
      {...conditionalProps}
      {...otherProps}
    >
      {loading ? (
        <ClipSpinner
          backgroundColor={spinnerColor.background}
          foregroundColor={spinnerColor.foreground}
          className={c(classes.spinner)}
        />
      ) : (
        <i className={c(classes.leadingIcon, classes.icon)}>{icon}</i>
      )}
    </RootNode>
  );
};

const IconButton = React.forwardRef(IconButtonBase) as Component;

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
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
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func
};

export default IconButton;
