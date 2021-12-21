import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import useInputBase from "../InputBase/useInputBase";
import type { MergeElementProps } from "../typings";
import {
  getVar,
  useEventCallback,
  useForkedRefs,
  useIsFocusVisible
} from "../utils";
import useStyles from "./styles";

interface InputAdornmentBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The variant of the component.
   * @default "node"
   */
  variant?: "node" | "icon" | "text";
}

export type InputAdornmentProps = MergeElementProps<
  "div",
  InputAdornmentBaseProps
>;

type Component = {
  (props: InputAdornmentProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<InputAdornmentProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["node", "icon", "text"] as const;

const InputAdornmentBase = (
  props: InputAdornmentProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    className,
    children,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    onClick,
    variant: variantProp = "node",
    ...otherProps
  } = props;

  const classes = useStyles();

  const variant = getVar(
    variantProp,
    "node",
    !allowedVariants.includes(variantProp)
  );

  const RootNode = variant === "icon" ? "i" : "div";

  const isActionable = onClick != null;

  const context = useInputBase();

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible<HTMLDivElement>();

  const adornmentRef = React.useRef<HTMLDivElement>();
  const handleRef = useForkedRefs(ref, focusVisibleRef, adornmentRef);

  const [focusVisible, setFocusVisible] = React.useState(false);

  if (context?.disabled && focusVisible) setFocusVisible(false);

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusVisible]);

  const handleFocus = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!adornmentRef.current) adornmentRef.current = event.currentTarget;

      handleFocusVisible(event);

      if (isFocusVisibleRef.current === true) setFocusVisible(true);
      if (onFocus) onFocus(event);
    }
  );

  const handleBlur = useEventCallback(event => {
    handleBlurVisible(event);

    if (isFocusVisibleRef.current === false) setFocusVisible(false);
    if (onBlur) onBlur(event);
  });

  const keyDownRef = React.useRef(false);

  const handleKeyDown = useEventCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (keyDownRef.current === false && focusVisible && event.key === " ") {
        keyDownRef.current = true;
      }

      if (event.target === event.currentTarget && event.key === " ") {
        event.preventDefault();
      }

      if (onKeyDown) onKeyDown(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        event.key.toLowerCase() === "enter" &&
        !context?.disabled
      ) {
        event.preventDefault();
        if (onClick)
          onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
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
        if (onClick)
          onClick(event as unknown as React.MouseEvent<HTMLDivElement>);
      }
    }
  );

  const actionProps = isActionable
    ? {
        onClick,
        onKeyDown: handleKeyDown,
        onKeyUp: handleKeyUp,
        onFocus: handleFocus,
        onBlur: handleBlur
      }
    : {};

  return (
    <RootNode
      ref={handleRef}
      role={isActionable ? "button" : undefined}
      tabIndex={isActionable ? (context?.disabled ? -1 : 0) : undefined}
      className={c(
        classes.root,
        className,
        classes[context?.size as keyof typeof classes],
        classes[`${variant}Adornment`],
        {
          [classes.focusVisible]: focusVisible,
          [classes.actionable]: isActionable,
          [classes.disabled]: context?.disabled,
          [classes.errored]: context?.hasError
        }
      )}
      {...actionProps}
      {...otherProps}
    >
      {children}
    </RootNode>
  );
};

const InputAdornment = React.forwardRef(InputAdornmentBase) as Component;

InputAdornment.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(allowedVariants),
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func
};

export default InputAdornment;
