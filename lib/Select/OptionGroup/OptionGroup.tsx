import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";

interface OptionGroupBaseProps {
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
}

export type SelectOptionGroupProps = MergeElementProps<
  "div",
  OptionGroupBaseProps
>;

type Component = {
  (props: SelectOptionGroupProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<SelectOptionGroupProps> | undefined;
  displayName?: string | undefined;
};

const SelectOptionGroupBase = (props: SelectOptionGroupProps) => (
  <>{props.children}</>
);

const SelectOptionGroup = SelectOptionGroupBase as Component;

SelectOptionGroup.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  className: PropTypes.string,
  titleClassName: PropTypes.string
};

export default SelectOptionGroup;
