import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the item. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If a label is provided,
   * the select component will use it as the item's display in the menu.
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
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  /**
   * The Callback fires when the item has received focus.
   *
   * @param {React.FocusEvent<HTMLDivElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  /**
   * The Callback fires when the item has lost focus.
   *
   * @param {React.FocusEvent<HTMLDivElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
};

export type SelectOptionProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface SelectOptionFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: SelectOptionProps<P>): JSX.Element;
}

declare const SelectOption: SelectOptionFC<{}>;

export default SelectOption;
