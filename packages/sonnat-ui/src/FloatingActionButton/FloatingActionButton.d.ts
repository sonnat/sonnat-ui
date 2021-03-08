import * as React from "react";
import {
  OverridableComponent,
  OverrideProps
} from "../utils/typings/OverridableComponent";

export type FloatingActionButtonTypeMap<
  P = {},
  N extends React.ElementType = "button"
> = {
  defaultRootNode: N;
  props: P & {
    /** The content of the button. */
    label?: string;
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * If `true`, the button will be disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * The size of the button when it only has a `leadingIcon`.
     * @default "medium"
     */
    iconButtonSize?: "small" | "medium" | "large";
    /**
     * The leading icon placed before the label.
     * When a string was provided, the component will use it as a `sonnat-icon` identifier.
     */
    leadingIcon?: React.ReactNode;
    // eslint-disable-next-line no-unused-vars
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  };
};

export type FloatingActionButtonProps<
  P = {},
  N extends React.ElementType = FloatingActionButtonTypeMap["defaultRootNode"]
> = OverrideProps<FloatingActionButtonTypeMap<P, N>, N>;

declare const FloatingActionButton: OverridableComponent<FloatingActionButtonTypeMap<
  {},
  "button"
>>;

export default FloatingActionButton;
