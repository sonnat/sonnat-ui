import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import {
  useEventCallback,
  useForkedRefs,
  useIsFocusVisible
} from "../../utils";
import useStyles from "./styles";

interface CardActionableAreaBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** Callback fired when the area is clicked. */
  // eslint-disable-next-line no-unused-vars
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export type CardActionableAreaProps = MergeElementProps<
  "div",
  CardActionableAreaBaseProps
>;

type Component = {
  (props: CardActionableAreaProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<CardActionableAreaProps> | undefined;
  displayName?: string | undefined;
};

const CardActionableAreaBase = (
  props: CardActionableAreaProps,
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
    ...otherProps
  } = props;

  const classes = useStyles();

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const actionRef = React.useRef<HTMLDivElement>();

  const handleRef = useForkedRefs(ref, focusVisibleRef, actionRef);

  const [focusVisible, setFocusVisible] = React.useState(false);

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusVisible]);

  const handleFocus = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!actionRef.current) actionRef.current = event.currentTarget;

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

      if (event.target === event.currentTarget && event.key === " ") {
        event.preventDefault();
      }

      if (onKeyDown) onKeyDown(event);

      // Keyboard accessibility for non interactive elements
      if (
        event.target === event.currentTarget &&
        event.key.toLowerCase() === "enter"
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

  return (
    <div
      role="button"
      tabIndex={0}
      ref={handleRef}
      className={c(classes.root, className, {
        [classes.focusVisible]: focusVisible
      })}
      onClick={onClick}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      {...otherProps}
    >
      {children}
    </div>
  );
};

const CardActionableArea = React.forwardRef(
  CardActionableAreaBase
) as Component;

CardActionableArea.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  onClick: PropTypes.func
};

export default CardActionableArea;
