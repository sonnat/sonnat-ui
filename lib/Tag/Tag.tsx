import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import Close from "../internals/icons/Close";
import type { MergeElementProps } from "../typings";
import {
  useConstantProp,
  useEventCallback,
  useForkedRefs,
  useIsFocusVisible
} from "../utils";
import useStyles from "./styles";

interface TagBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The label of the tag.
   */
  label: string;
  /**
   * The leading icon element placed before the label.
   */
  icon?: React.ReactNode;
  /**
   * If `true`, will make the tag denser.
   * @default false
   */
  dense?: boolean;
  /**
   * If `true`, will make the tag visible.
   * @default true
   */
  visible?: boolean;
  /**
   * The variant of the tag.
   * @default "filled"
   */
  variant?: "filled" | "outlined";
  /**
   * The color of the tag.
   * @default "default"
   */
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info";
  /**
   * The Callback fires when the tag's remove button is clicked.
   */
  onRemove?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export type TagProps = MergeElementProps<"div", TagBaseProps>;

type Component = {
  (props: TagProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TagProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["filled", "outlined"] as const;
const allowedColors = [
  "default",
  "primary",
  "secondary",
  "success",
  "error",
  "warning",
  "info"
] as const;

const TagBase = (props: TagProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className,
    icon,
    label,
    onRemove,
    variant = "filled",
    color = "default",
    visible = true,
    dense = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  const isRemovable = useConstantProp(onRemove != null, false, {
    componentName: "Tag",
    propName: "onRemove"
  });

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible<HTMLButtonElement>();

  const removeRef = React.useRef<HTMLButtonElement>();
  const handleRemoveRef = useForkedRefs(focusVisibleRef, removeRef);

  const [focusVisible, setFocusVisible] = React.useState(false);

  React.useEffect(() => {
    if (!visible && focusVisible) setFocusVisible(false);
  }, [visible, focusVisible]);

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
    (event: React.FocusEvent<HTMLButtonElement>) => {
      handleBlurVisible(event);

      if (isFocusVisibleRef.current === false) setFocusVisible(false);
    }
  );

  return visible ? (
    <div
      ref={ref}
      className={c(classes.root, className, {
        [classes[variant]]: allowedVariants.includes(variant),
        [classes[color]]: allowedColors.includes(color),
        [classes.removable]: isRemovable,
        [classes.dense]: dense
      })}
      {...otherProps}
    >
      {icon && <i className={classes.icon}>{icon}</i>}
      <span className={classes.label}>{label}</span>
      {isRemovable && (
        <button
          aria-label={`Remove the tag with ${label} text`}
          ref={handleRemoveRef}
          onFocus={handleFocus}
          onBlur={handleBlur}
          tabIndex={visible ? 0 : -1}
          className={c(classes.removeBtn, {
            [classes.focusVisible]: focusVisible
          })}
          onClick={onRemove}
        >
          <i className={classes.removeBtnIcon}>
            <Close />
          </i>
        </button>
      )}
    </div>
  ) : null;
};

const Tag = React.forwardRef(TagBase) as Component;

Tag.propTypes = {
  icon: PropTypes.node,
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  dense: PropTypes.bool,
  visible: PropTypes.bool,
  variant: PropTypes.oneOf(allowedVariants),
  color: PropTypes.oneOf(allowedColors),
  onRemove: PropTypes.func
};

export default Tag;
