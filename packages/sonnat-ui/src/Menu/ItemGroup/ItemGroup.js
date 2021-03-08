import React, { useContext } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import generateUniqueString from "../../utils/generateUniqueString";
import FloatedListContext from "../context";
import { isFragment } from "react-is";
import { componentName as itemName } from "../Item";
import makeStyles from "../../styles/makeStyles";

export const componentName = "MenuItemGroup";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      typography: { pxToRem, useText }
    } = theme;

    return {
      root: {},
      title: {
        ...useText({ fontSize: pxToRem(14), color: colors.text.primary }),
        paddingRight: pxToRem(16),
        paddingLeft: pxToRem(16),
        height: pxToRem(40),
        flexGrow: "1",
        display: "flex",
        alignItems: "center"
      },
      dense: { "& $title": { height: pxToRem(32), fontSize: pxToRem(12) } },
      hide: { display: "none" }
    };
  },
  { name: `Sonnat${componentName}` }
);

const MenuItemGroup = React.memo(function MenuItemGroup(props) {
  const {
    className,
    titleClassName,
    title,
    /* eslint-disable react/prop-types */
    index: indexProp,
    visibleChilds = [],
    children: childrenProp,
    ...otherProps
  } = props;

  const localClass = useStyles();

  const { dense } = useContext(FloatedListContext);

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

    if (child.type.displayName !== itemName) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The MenuItemGroup component only accepts `Menu/Item` component."
      );

      return null;
    }

    const hide = visibleChilds
      ? !visibleChilds.includes(indexProp + itemIndex)
      : false;
    const currentIndex = indexProp + itemIndex++;

    if (hide) hides++;

    return React.cloneElement(child, {
      hide,
      index: currentIndex,
      key: `${generateUniqueString()}/${currentIndex}`
    });
  });

  const isHidden = hides === children.filter(Boolean).length;

  return (
    <div
      role="menu"
      className={createClass(localClass.root, className, {
        [localClass.hide]: isHidden,
        [localClass.dense]: dense
      })}
      {...otherProps}
    >
      <strong className={createClass(localClass.title, titleClassName)}>
        {title}
      </strong>
      {children}
    </div>
  );
});

MenuItemGroup.displayName = componentName;

MenuItemGroup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  titleClassName: PropTypes.string
};

export default MenuItemGroup;
