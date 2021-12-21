/* eslint-disable @typescript-eslint/no-non-null-assertion */
import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import { isFragment } from "react-is";
import type { MergeElementProps } from "../../typings";
import generateUniqueString from "../../utils/generateUniqueString";
import MenuContext from "../context";
import Item from "../Item";
import useStyles from "./styles";

interface ItemGroupBaseProps {
  /** The content of the group. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Append to the classNames applied to the title so you can override or
   * extend the styles.
   */
  titleClassName?: string;
  /** The title of the group. */
  title?: string;
  /**
   * @internal
   * @ignore
   */
  index?: number;
  /**
   * @internal
   * @ignore
   */
  visibleChilds?: number[] | null;
}

export type ItemGroupProps = MergeElementProps<"div", ItemGroupBaseProps>;

type Component = {
  (props: ItemGroupProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<ItemGroupProps> | undefined;
  displayName?: string | undefined;
};

const MenuItemGroupBase = (props: ItemGroupProps) => {
  const {
    className,
    titleClassName,
    title,
    index: indexProp,
    visibleChilds,
    children: childrenProp,
    ...otherProps
  } = props;

  const classes = useStyles();

  const context = React.useContext(MenuContext);

  let hides = 0;
  let itemIndex = 0;
  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) return null;

    if (isFragment(child)) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The MenuItemGroup component doesn't accept a Fragment as a child."
      );

      return null;
    }

    if ((child as React.ReactElement).type !== Item) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The MenuItemGroup component only accepts `Menu/Item` component."
      );

      return null;
    }

    const hide = visibleChilds
      ? !visibleChilds.includes(indexProp! + itemIndex)
      : false;
    const currentIndex = indexProp! + itemIndex++;

    if (hide) hides++;

    return React.cloneElement(child, {
      hide,
      index: currentIndex,
      key: `${generateUniqueString()}/${currentIndex}`
    });
  });

  const isHidden = children ? hides === children.filter(Boolean).length : true;

  return (
    <div
      role="menu"
      className={c(classes.root, className, {
        [classes.hide]: isHidden,
        [classes.dense]: context?.dense
      })}
      {...otherProps}
    >
      <strong className={c(classes.title, titleClassName)}>{title}</strong>
      {children}
    </div>
  );
};

const MenuItemGroup = MenuItemGroupBase as Component;

MenuItemGroup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  titleClassName: PropTypes.string
};

export default MenuItemGroup;
