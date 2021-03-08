import * as React from "react";
import {
  OverridableComponent,
  OverrideProps
} from "../utils/typings/OverridableComponent";

export type DividerTypeMap<P = {}, N extends React.ElementType = "hr"> = {
  defaultRootNode: N;
  props: P & {
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * If `true`, the divider will have spaces around it.
     * @default false
     */
    spaced?: boolean;
    /**
     * If `true`, the divider will be 3-dots instead of a straight line.
     *
     * You can't use `dotted` along with `vertical`!
     * @default false
     */
    dotted?: boolean;
    /**
     * If `true`, the divider will be vertical.
     *
     * It only works in flexboxes!
     * (the parent should be a flexbox and the divider itself has to be a flex-item)
     * @default false
     */
    vertical?: boolean;
  };
};

export type DividerProps<
  P = {},
  N extends React.ElementType = DividerTypeMap["defaultRootNode"]
> = OverrideProps<DividerTypeMap<P, N>, N>;

declare const Divider: OverridableComponent<DividerTypeMap<{}, "hr">>;

export default Divider;
