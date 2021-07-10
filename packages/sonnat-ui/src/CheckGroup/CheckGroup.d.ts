import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /** The content of the group. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The name of the checkbox controls. */
  name?: string;
  /** The values of the selected checkboxes. */
  value?: string[];
  /** The default value. Use when the component is not controlled. */
  defaultValue?: string[];
  /**
   * The layout direction of the group.
   * @default "column"
   */
  layoutDirection?: "row" | "column";
  /**
   * The Callback fires when a checkbox has selected.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {string[]} selectedValues The values of the selected checkboxes.
   */
  onChange?: (
    /* eslint-disable no-unused-vars */
    event: React.ChangeEvent<HTMLInputElement>,
    selectedValues: string[]
    /* eslint-enable no-unused-vars */
  ) => void;
};

export type CheckGroupProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const CheckGroup: (props: CheckGroupProps) => JSX.Element;

export default CheckGroup;
