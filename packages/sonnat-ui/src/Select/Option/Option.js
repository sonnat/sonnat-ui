/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";

const componentName = "SelectOption";

const SelectOption = function SelectOption({ children }) {
  return <React.Fragment>{children}</React.Fragment>;
};

SelectOption.displayName = componentName;

SelectOption.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool
};

export default SelectOption;
