import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";

interface OptionBaseProps {
  /** The content of the item. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The value of the option.
   */
  value: string;
  /**
   * If a label was provided,
   * the select component will use it as the item's display value.
   *
   * It is mandatory to use it when the `children` prop contains
   * not just the label but also some extra HTMLElements as well.
   */
  label?: string;
  /**
   * If `true`, the item will be disabled.
   * @default false
   */
  disabled?: boolean;
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

export type SelectOptionProps = MergeElementProps<"div", OptionBaseProps>;

type Component = {
  (props: SelectOptionProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<SelectOptionProps> | undefined;
  displayName?: string | undefined;
};

const SelectOptionBase = (props: SelectOptionProps) => <>{props.children}</>;

const SelectOption = SelectOptionBase as Component;

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
