/* eslint-disable no-unused-vars */
import type { OverridableStringUnion } from "../typings";

export type BreakpointDefaults = Record<
  "xxs" | "xs" | "sm" | "md" | "lg" | "xl" | "xlg",
  true
>;
export interface BreakpointOverrides {}
export type Breakpoint = OverridableStringUnion<
  BreakpointDefaults,
  BreakpointOverrides
>;

export type BreakpointValues = { [key in Breakpoint]: number };

export interface Breakpoints {
  keys: Breakpoint[];
  values: BreakpointValues;
  up: (key: Breakpoint | number) => string;
  down: (key: Breakpoint | number) => string;
  between: (
    startKey: Breakpoint | number,
    endKey: Breakpoint | number
  ) => string;
  width: (key: Breakpoint) => number;
}

export type BreakpointsInputs = Partial<
  {
    unit: string;
    step: number;
  } & Partial<Pick<Breakpoints, "values">>
>;

export default function createBreakpoints(
  options: BreakpointsInputs
): Breakpoints;
