import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import {
  camelCase,
  getVar,
  isUndef,
  useEventCallback,
  useForkedRefs,
  useIsFocusVisible
} from "../utils";
import useStyles, { VariantColorCombo } from "./styles";

interface ActionChipBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The text of the chip. */
  label: string;
  /**
   * The leading icon element placed before the label.
   */
  leadingIcon?: React.ReactNode;
  /**
   * The size of the chip.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The color of the chip.
   * @default "default"
   */
  color?: "default" | "primary" | "secondary";
  /**
   * The variant of the chip.
   * @default "filled"
   */
  variant?: "filled" | "outlined";
  /**
   * If `true`, the chip will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the chip will be disabled.
   * @default false
   */
  disabled?: boolean;
}

type ActionChipProps = Omit<
  React.ComponentPropsWithRef<"div">,
  keyof ActionChipBaseProps
> &
  ActionChipBaseProps;

const allowedVariants = ["filled", "outlined"] as const;
const allowedSizes = ["large", "medium", "small"] as const;
const allowedColors = ["default", "primary", "secondary"] as const;

const ActionChipBase = (
  props: ActionChipProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    className,
    label,
    leadingIcon,
    onClick,
    onFocus,
    onBlur,
    onKeyUp,
    onKeyDown,
    size: sizeProp = "medium",
    variant: variantProp = "filled",
    color: colorProp = "default",
    disabled = false,
    rounded = false,
    ...otherProps
  } = props;

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

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const chipRef = React.useRef<HTMLDivElement>();
  const handleRef = useForkedRefs(chipRef, focusVisibleRef, ref);

  const [focusVisible, setFocusVisible] = React.useState(false);

  if (disabled && focusVisible) setFocusVisible(false);

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusVisible]);

  const handleFocus = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!chipRef.current) chipRef.current = event.currentTarget;

      handleFocusVisible(event);

      if (isFocusVisibleRef.current === true) setFocusVisible(true);
      if (onFocus) onFocus(event);
    }
  );

  const handleBlur = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      handleBlurVisible(event);

      if (isFocusVisibleRef.current === false) setFocusVisible(false);
      if (onBlur) onBlur(event);
    }
  );

  const keyDownRef = React.useRef(false);

  const handleKeyDown = useEventCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (keyDownRef.current === false && focusVisible && event.key === " ") {
        keyDownRef.current = true;
      }

      if (onKeyDown) onKeyDown(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        event.key.toLowerCase() === "enter" &&
        !disabled
      ) {
        event.preventDefault();
        if (onClick) {
          onClick(
            event as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>
          );
        }
      }
    }
  );

  const handleKeyUp = useEventCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!event.defaultPrevented && focusVisible && event.key === " ") {
        keyDownRef.current = false;
      }

      if (onKeyUp) onKeyUp(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        event.key === " " &&
        !event.defaultPrevented
      ) {
        if (onClick) {
          onClick(
            event as unknown as React.MouseEvent<HTMLDivElement, MouseEvent>
          );
        }
      }
    }
  );

  if (isUndef(label) || label.length === 0) return null;

  return (
    <div
      ref={handleRef}
      role="button"
      aria-disabled={disabled ? "true" : "false"}
      tabIndex={disabled ? -1 : 0}
      onClick={onClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      className={c(
        className,
        classes.root,
        classes[size],
        classes[variant],
        classes[camelCase(`${variant}-${color}`) as VariantColorCombo],
        {
          [classes.focusVisible]: focusVisible,
          [classes.rounded]: rounded,
          [classes.disabled]: disabled
        }
      )}
      {...otherProps}
    >
      {leadingIcon && <i className={c(classes.icon)}>{leadingIcon}</i>}
      {label}
    </div>
  );
};

const ActionChip = React.forwardRef(
  ActionChipBase
) as React.FC<ActionChipProps>;

ActionChip.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  leadingIcon: PropTypes.node,
  size: PropTypes.oneOf(allowedSizes),
  color: PropTypes.oneOf(allowedColors),
  variant: PropTypes.oneOf(allowedVariants),
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func
};

export default ActionChip;
