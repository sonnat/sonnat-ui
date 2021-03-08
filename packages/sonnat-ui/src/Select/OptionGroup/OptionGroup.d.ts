import * as React from "react";

type BaseProps<P = {}> = P & {
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
};

export type SelectOptionGroupProps<P> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface SelectOptionGroupFC<P> {
  // eslint-disable-next-line no-unused-vars
  (props: SelectOptionGroupProps<P>): JSX.Element;
}

declare const SelectOptionGroup: SelectOptionGroupFC<{}>;

export default SelectOptionGroup;
