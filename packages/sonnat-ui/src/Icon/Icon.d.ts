import * as React from "react";
import {
  OverridableComponent,
  OverrideProps
} from "../utils/typings/OverridableComponent";

export type IconTypeMap<P = {}, N extends React.ElementType = "i"> = {
  defaultRootNode: N;
  props: P & {
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * The color of the icon.
     * @default "inherit"
     */
    color?:
      | "inherit"
      | "textPrimary"
      | "textSecondary"
      | "textHint"
      | "textDisabled"
      | "primary"
      | "secondary"
      | "error"
      | "success"
      | "warning"
      | "info" = "inherit";
    /** The `sonnat-icon`'s font identifier.
     *
     * @example
     * "name-spaced-by-dashes" | "camelCasedName"
     */
    identifier?: string;
    /** The size of the icon */
    size?: number;
  };
};

export type IconProps<
  P = {},
  N extends React.ElementType = IconTypeMap["defaultRootNode"]
> = OverrideProps<IconTypeMap<P, N>, N>;

declare const Icon: OverridableComponent<IconTypeMap<{}, "i">>;

export default Icon;
