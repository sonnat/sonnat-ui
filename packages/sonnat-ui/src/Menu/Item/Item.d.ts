import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the item. */
    children?: React.ReactNode;
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * If `true`, the item will be disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * If `true`, the item will be hidden.
     * @internal
     * @ignore
     * @default false
     */
    hide?: boolean;
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

export type MenuItemProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const MenuItem: (props: MenuItemProps) => JSX.Element;

export default MenuItem;
