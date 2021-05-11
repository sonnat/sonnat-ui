import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The label of the Tag.
   */
  label?: string;
  /**
   * The icon placed before the label.
   * The component will use it as a `sonnat-icon` identifier.
   */
  icon?: React.ReactNode;
  /**
   * The variant of the Tag.
   * @default "filled"
   */
  variant?: "filled" | "outlined";
};

export type TagProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface TagFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TagProps<P>): JSX.Element;
}

declare const Tag: TagFC<{}>;

export default Tag;
