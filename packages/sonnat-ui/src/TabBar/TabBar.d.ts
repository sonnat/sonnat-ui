import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The currently selected Tab.
   * If you don't want any selected Tab, you can set this property to `""`.
   */
  activeTab?: number | string;
  /** The default selected Tab. Use when the component is not controlled. */
  defaultActiveTab?: number | string;
  /**
   * If `true`, will invoke scrolling properties and
   * allow for horizontally scrolling (or swiping) of the TabBar.
   * @default false
   */
  scrollable?: boolean;
  /**
   * If `true`, will make the TabBar grow to use all the available space.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, will make the TabBar and the Tabs dense.
   * @default false
   */
  dense?: boolean;
  /**
   * Determine the behavior of scroll handles when TabBar is set to `scrollable`:
   * - `auto` will only present them when not all the items are visible.
   * - `off` will never present them.
   * @default "auto"
   */
  scrollHandleVisibility?: "auto" | "off";
  /**
   * The Callback fires when the state has changed.
   *
   * @param {React.SyntheticEvent} event The event source of the callback.
   * @param {number | string} identifier The identifier of the active Tab.
   */
  onChange?: (
    /* eslint-disable no-unused-vars */
    event: React.SyntheticEvent,
    identifier: number | string
    /* eslint-enable no-unused-vars */
  ) => void;
};

export type TabBarProps<P> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface TabBarFC<P> {
  // eslint-disable-next-line no-unused-vars
  (props: TabBarProps<P>): JSX.Element;
}

declare const TabBar: TabBarFC<{}>;

export default TabBar;
