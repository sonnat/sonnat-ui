import * as React from "react";

type BaseProps<P = {}> = P & {
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

export type TabBarProps<P> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface TabBarFC<P> {
  // eslint-disable-next-line no-unused-vars
  (props: TabBarProps<P>): JSX.Element;
}

declare const TabBar: TabBarFC<{}>;

export default TabBar;
