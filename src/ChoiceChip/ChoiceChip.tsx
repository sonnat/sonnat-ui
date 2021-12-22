import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import {
  camelCase,
  getVar,
  useControlledProp,
  useEventCallback,
  useForkedRefs,
  useIsFocusVisible
} from "../utils";
import useStyles, {
  VariantColorSelectionCombo,
  VariantUnselectionCombo
} from "./styles";

interface ChoiceChipBaseProps {
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
   * The default state of `selected`. Use when the component is not controlled.
   * @default false
   */
  defaultSelected?: boolean;
  /**
   * If `true`, the chip will be selected.
   * @default false
   */
  selected?: boolean;
  /**
   * The Callback fires when the chip has selected/deselected.
   */
  onToggle?: (isSelected: boolean) => void;
}

export type ChoiceChipProps = MergeElementProps<"div", ChoiceChipBaseProps>;

type Component = {
  (props: ChoiceChipProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<ChoiceChipProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["filled", "outlined"] as const;
const allowedSizes = ["large", "medium", "small"] as const;
const allowedColors = ["default", "primary", "secondary"] as const;

const ChoiceChipBase = (
  props: ChoiceChipProps,
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
    onToggle,
    selected,
    defaultSelected,
    variant: variantProp = "filled",
    size: sizeProp = "medium",
    color: colorProp = "default",
    disabled = false,
    rounded = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  const [isSelected, setSelected] = useControlledProp(
    selected,
    defaultSelected,
    false
  );

  const toggleHandler = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>
  ) => {
    if (onToggle) onToggle(!isSelected);
    if (onClick) onClick(e as React.MouseEvent<HTMLDivElement>);
    setSelected(!isSelected);
  };

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
  } = useIsFocusVisible<HTMLDivElement>();

  const chipRef = React.useRef<HTMLDivElement>();

  const handleRef = useForkedRefs(ref, focusVisibleRef, chipRef);

  const [focusVisible, setFocusVisible] = React.useState(false);

  if (disabled && focusVisible) {
    setFocusVisible(false);
  }

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
        toggleHandler(event);
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
        toggleHandler(event);
      }
    }
  );

  return label ? (
    <div
      ref={handleRef}
      role="button"
      aria-disabled={disabled ? "true" : "false"}
      tabIndex={disabled ? -1 : 0}
      onClick={toggleHandler}
      onKeyUp={handleKeyUp}
      onKeyDown={handleKeyDown}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={c(className, classes.root, classes[size], classes[variant], {
        [classes.selected]: isSelected,
        [classes.focusVisible]: focusVisible,
        [classes[
          camelCase(`${variant}-unselected`) as VariantUnselectionCombo
        ]]: !isSelected,
        [classes[
          camelCase(
            `${variant}-${color}-selected`
          ) as VariantColorSelectionCombo
        ]]: isSelected,
        [classes.rounded]: rounded,
        [classes.disabled]: disabled
      })}
      {...otherProps}
    >
      {leadingIcon && <i className={c(classes.icon)}>{leadingIcon}</i>}
      {label}
    </div>
  ) : null;
};

const ChoiceChip = React.forwardRef(ChoiceChipBase) as Component;

ChoiceChip.propTypes = {
  label: PropTypes.string.isRequired,
  leadingIcon: PropTypes.node,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  disabled: PropTypes.bool,
  selected: PropTypes.bool,
  defaultSelected: PropTypes.bool,
  size: PropTypes.oneOf(allowedSizes),
  color: PropTypes.oneOf(allowedColors),
  variant: PropTypes.oneOf(allowedVariants),
  onToggle: PropTypes.func,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func
};

export default ChoiceChip;
