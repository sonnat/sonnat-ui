import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * The label of the tag.
     */
    label: string;
    /**
     * The leading icon element placed before the label.
     */
    icon?: React.ReactNode;
    /**
     * If `true`, will make the tag denser.
     * @default false
     */
    dense?: boolean;
    /**
     * The variant of the tag.
     * @default "filled"
     */
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

export type TagProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const Tag: (props: TagProps) => JSX.Element;

export default Tag;
