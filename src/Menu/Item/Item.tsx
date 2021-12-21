/* eslint-disable @typescript-eslint/no-non-null-assertion */
import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import useIsomorphicLayoutEffect from "../../utils/useIsomorphicLayoutEffect";
import MenuContext from "../context";
import useStyles from "./styles";

interface ItemBaseProps {
  /** The content of the item. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the item will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the item will be hidden.
   * @internal
   * @ignore
   * @default false
   */
  hide?: boolean;
  /**
   * @internal
   * @ignore
   */
  index?: number;
  /**
   * The Callback fires when the item has been clicked.
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /**
   * The Callback fires when the item has received focus.
   */
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  /**
   * The Callback fires when the item has lost focus.
   */
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
}

export type ItemProps = MergeElementProps<"div", ItemBaseProps>;

type Component = {
  (props: ItemProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<ItemProps> | undefined;
  displayName?: string | undefined;
};

const MenuItemBase = (props: ItemProps) => {
  const {
    className,
    children,
    onClick,
    onFocus,
    onBlur,
    index,
    disabled = false,
    hide = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  const context = React.useContext(MenuContext);

  const itemRef = React.useRef<
    (HTMLDivElement & { disabled?: boolean }) | null
  >(null);

  const [isFocused, setFocused] = React.useState(false);

  useIsomorphicLayoutEffect(() => {
    if (itemRef.current && context?.registerNode) {
      itemRef.current.disabled = disabled;
      context.registerNode(index!, itemRef.current);
    }
  });

  return (
    <div
      aria-disabled={disabled}
      data-index={`${index!}`}
      ref={itemRef}
      role="menuitem"
      tabIndex={disabled || !isFocused ? -1 : 0}
      onClick={e => {
        if (!disabled && onClick) onClick(e);
      }}
      onFocus={e => {
        if (!disabled) {
          if (onFocus) onFocus(e);
          setFocused(true);
        }
      }}
      onBlur={e => {
        if (!disabled) {
          if (onBlur) onBlur(e);
          setFocused(false);
        }
      }}
      className={c(classes.root, className, {
        [classes.focused]: isFocused,
        [classes.disabled]: disabled,
        [classes.hide]: hide,
        [classes.dense]: context?.dense
      })}
      {...otherProps}
    >
      {children}
    </div>
  );
};

const MenuItem = MenuItemBase as Component;

MenuItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  hide: PropTypes.bool
};

export default MenuItem;
