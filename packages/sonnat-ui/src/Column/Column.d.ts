import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

type GridNumbers =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12";

interface ColumnBreakpointObject {
  /** The column's size. */
  size?: GridNumbers;
  /** The flexbox's `order` property of the column. */
  order?: GridNumbers;
  /** The column's offset.
   * (offset from right if its 'right to left' and offset from left if its 'left to right'.)
   */
  offset?: GridNumbers;
}

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /** The content of the column. */
    children?: React.ReactNode;
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * Defines the number of grids the component is going to use.
     * It's applied for the all breakpoints if not overridden.
     */
    all?: GridNumbers | ColumnBreakpointObject;
    /**
     * Defines the number of grids the component is going to use.
     * It's applied for the `xxs` breakpoint and wider screens if not overridden.
     */
    xxs?: GridNumbers | ColumnBreakpointObject;
    /**
     * Defines the number of grids the component is going to use.
     * It's applied for the `xs` breakpoint and wider screens if not overridden.
     */
    xs?: GridNumbers | ColumnBreakpointObject;
    /**
     * Defines the number of grids the component is going to use.
     * It's applied for the `sm` breakpoint and wider screens if not overridden.
     */
    sm?: GridNumbers | ColumnBreakpointObject;
    /**
     * Defines the number of grids the component is going to use.
     * It's applied for the `md` breakpoint and wider screens if not overridden.
     */
    md?: GridNumbers | ColumnBreakpointObject;
    /**
     * Defines the number of grids the component is going to use.
     * It's applied for the `lg` breakpoint and wider screens if not overridden.
     */
    lg?: GridNumbers | ColumnBreakpointObject;
    /**
     * Defines the number of grids the component is going to use.
     * It's applied for the `xlg` breakpoint and wider screens if not overridden.
     */
    xlg?: GridNumbers | ColumnBreakpointObject;
  };

export type ColumnProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const Column: (props: ColumnProps) => JSX.Element;

export default Column;
