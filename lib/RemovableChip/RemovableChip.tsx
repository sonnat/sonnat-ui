import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import Close from "../internals/icons/Close";
import type { MergeElementProps } from "../typings";
import {
  camelCase,
  getVar,
  useEventCallback,
  useForkedRefs,
  useIsFocusVisible
} from "../utils";
import useStyles from "./styles";

interface BaseProps {
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
  /**
   * The Callback fires when the chip's remove button is clicked.
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export type RemovableChipProps = MergeElementProps<"div", BaseProps>;

type Component = {
  (props: RemovableChipProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<RemovableChipProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["filled", "outlined"] as const;
const allowedSizes = ["large", "medium", "small"] as const;
const allowedColors = ["default", "primary", "secondary"] as const;

const RemovableChipBase = (
  props: RemovableChipProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    className,
    label,
    leadingIcon,
    onRemove,
    rounded = false,
    disabled = false,
    variant: variantProp = "filled",
    color: colorProp = "default",
    size: sizeProp = "medium",
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

  const removeHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && onRemove) onRemove(e);
  };

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const removeRef = React.useRef<HTMLButtonElement>();
  const handleRemoveRef = useForkedRefs(focusVisibleRef, removeRef);

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
      if (!removeRef.current) removeRef.current = event.currentTarget;

      handleFocusVisible(event);

      if (isFocusVisibleRef.current === true) setFocusVisible(true);
    }
  );

  const handleBlur = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      handleBlurVisible(event);

      if (isFocusVisibleRef.current === false) setFocusVisible(false);
    }
  );

  return label ? (
    <div
      aria-disabled={disabled ? "true" : "false"}
      ref={ref}
      className={c(
        className,
        classes.root,
        classes[size],
        classes[variant],
        classes[camelCase(`${variant}-${color}`) as keyof typeof classes],
        {
          [classes.rounded]: rounded,
          [classes.disabled]: disabled
        }
      )}
      {...otherProps}
    >
      {leadingIcon && <i className={c(classes.icon)}>{leadingIcon}</i>}
      {label}
      <button
        aria-label={`Remove the chip with ${label} text`}
        ref={handleRemoveRef}
        className={c(classes.removeButton, {
          [classes.focusVisible]: focusVisible
        })}
        onClick={removeHandler}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        tabIndex={disabled ? -1 : 0}
      >
        <i className={c(classes.removeButtonIcon)}>
          <Close />
        </i>
      </button>
    </div>
  ) : null;
};

const RemovableChip = React.forwardRef(RemovableChipBase) as Component;

RemovableChip.propTypes = {
  label: PropTypes.string.isRequired,
  leadingIcon: PropTypes.node,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  color: PropTypes.oneOf(allowedColors),
  variant: PropTypes.oneOf(allowedVariants),
  size: PropTypes.oneOf(allowedSizes),
  onRemove: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func
};

export default RemovableChip;
