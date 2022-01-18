export type BreakpointDefaults = Record<
  "xxs" | "xs" | "sm" | "md" | "lg" | "xlg",
  true
>;

export type Breakpoint = keyof BreakpointDefaults;

export interface Breakpoints {
  keys: Breakpoint[];
  values: Record<Breakpoint, number>;
  up: (key: Breakpoint | number) => string;
  down: (key: Breakpoint | number) => string;
  between: (
    startKey: Breakpoint | number,
    endKey: Breakpoint | number
  ) => string;
  width: (key: Breakpoint) => number;
}

export interface BreakpointsInput {
  values: Breakpoints["values"];
}

export const keys: Breakpoints["keys"] = ["xxs", "xs", "sm", "md", "lg", "xlg"];

const createBreakpoints = (
  breakpointsInput?: BreakpointsInput
): Breakpoints => {
  const {
    values = {
      xxs: 320,
      xs: 520,
      sm: 768,
      md: 960,
      lg: 1024,
      xlg: 1366
    } as Breakpoints["values"]
  } = breakpointsInput || {};

  const unit = "px" as const;
  const step = 5 as const;

  const up: Breakpoints["up"] = key => {
    const value = typeof key === "number" ? key : values[key];
    return `@media (min-width:${value}${unit})`;
  };

  const down: Breakpoints["down"] = key => {
    const value = typeof key === "number" ? key : values[key];

    if (typeof key !== "number" && keys.indexOf(key) === keys.length - 1)
      return up("xxs");

    return `@media (max-width:${value - step / 100}${unit})`;
  };

  const between: Breakpoints["between"] = (startKey, endKey) => {
    const endIndex = typeof endKey !== "number" ? keys.indexOf(endKey) : -1;

    if (endIndex === keys.length - 1) return up(startKey);

    const minVal = typeof startKey === "number" ? startKey : values[startKey];

    const maxVal =
      endIndex !== -1 && typeof values[keys[endIndex]] === "number"
        ? values[keys[endIndex]]
        : (endKey as number);

    return (
      `@media (min-width:${minVal}${unit}) and ` +
      `(max-width:${maxVal - step / 100}${unit})`
    );
  };

  const width: Breakpoints["width"] = key => values[key];

  return {
    keys,
    values,
    up,
    down,
    between,
    width
  };
};

export default createBreakpoints;
