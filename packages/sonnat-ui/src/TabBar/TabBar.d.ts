import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the component. */
    children?: React.ReactNode;
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /** The currently selected tab. */
    activeTab?: number | string;
    /** The default selected tab. Use when the component is not controlled. */
    defaultActiveTab?: number | string;
    /**
     * If `true`, will make the tabbar and the tabs dense.
     * @default false
     */
    dense?: boolean;
    /**
     * Determines the behavior of scroll buttons when `variant="scrollable"`:
     * - `auto` will automatically show them on overflow.
     * - `off` wont show them.
     * @default "auto"
     */
    scrollHandleVisibility?: "auto" | "off";
    /**
     * The variant of the tabbar.
     * @default "fluid"
     */
    variant?: "scrollable" | "fluid";
    /**
     * The size of the tabbar.
     * @default "medium"
     */
    size?: "large" | "medium" | "small";
    /**
     * The Callback fires when the state has changed.
     *
     * @param {React.SyntheticEvent | Event} event The event source of the callback.
     * @param {number | string} identifier The identifier of the active Tab.
     */
    onChange?: (
      /* eslint-disable no-unused-vars */
      event: React.SyntheticEvent | Event,
      identifier: number | string
      /* eslint-enable no-unused-vars */
    ) => void;
  };

export type TabBarProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const TabBar: (props: TabBarProps) => JSX.Element;

export default TabBar;
