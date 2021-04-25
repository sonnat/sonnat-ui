/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import { isFragment } from "react-is";
import { componentName as optionName } from "../Option";
import generateUniqueString from "../../utils/generateUniqueString";

export const componentName = "SelectOptionGroup";

const SelectOptionGroup = React.memo(function SelectOptionGroup({
  children: childrenProp
}) {
  const children = React.Children.map(childrenProp, (child, index) => {
    if (!React.isValidElement(child)) return null;

    if (isFragment(child)) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The SelectOptionGroup component doesn't accept a Fragment as a child."
      );

      return null;
    }

    if (child.type.displayName !== optionName) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The SelectOptionGroup component only accepts `Select/Option` component."
      );

      return null;
    }

    return React.cloneElement(child, {
      key: `${generateUniqueString()}/${index}`
    });
  });

  return <React.Fragment>{children}</React.Fragment>;
});

SelectOptionGroup.displayName = componentName;

SelectOptionGroup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  titleClassName: PropTypes.string
};

export default SelectOptionGroup;
