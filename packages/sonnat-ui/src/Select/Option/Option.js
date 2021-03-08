/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";

export const componentName = "SelectOption";

const SelectOption = React.memo(function SelectOption(props) {
  const {
    className,
    label,
    children,
    onClick,
    onFocus,
    onBlur,
    disabled = false,
    ...otherProps
  } = props;

  return <React.Fragment>{children}</React.Fragment>;
});

SelectOption.displayName = componentName;

SelectOption.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool
};

export default SelectOption;
