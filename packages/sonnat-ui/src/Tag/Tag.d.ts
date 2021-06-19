import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The label of the tag.
   */
  label?: string;
  /**
   * The leading icon element placed before the label.
   */
  icon?: React.ReactNode;
  /**
   * The variant of the tag.
   * @default "filled"
   */
  /**
   * If `true`, will make the tag denser.
   * @default false
   */
  dense?: boolean;
  variant?: "filled" | "outlined";
  /**
   * The color of the tag.
   * @default "default"
   */
  color?:
    | "default"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "warning"
    | "info";
  /**
   * The Callback fires when the tag's remove button is clicked.
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onRemove?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

export type TagProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface TagFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TagProps<P>): JSX.Element;
}

declare const Tag: TagFC<{}>;

export default Tag;
