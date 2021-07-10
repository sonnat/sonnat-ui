import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /** The text to display. */
  text: string;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The text to display on the undo button.
   */
  undoButtonLabel?: string;
  /**
   * The leading icon element placed before the text.
   */
  icon?: React.ReactNode;
  /**
   * The horizontal placement of the snackbar.
   * @default "center"
   */
  placement?: "left" | "center" | "right";
  /**
   * If `true`, the component will be open.
   * @default false
   */
  open?: boolean;
  /**
   * If `true`, the snackbar will have close button.
   * @default false
   */
  closable?: boolean;
  /**
   * If `true`, the snackbar will have undo button.
   * @default false
   */
  undoable?: boolean;
  /**
   * The Callback fires when the component has closed.
   */
  onClose?: () => void;
  /**
   * The Callback fires when the item has received focus.
   */
  onUndo?: () => void;
  /**
   * The Callback fires when the transition has ended.
   *
   * @param {React.TransitionEvent<HTMLDivElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onTransitionEnd?: (event: React.TransitionEvent<HTMLDivElement>) => void;
};

export type SnackbarProps<
  P = {},
  T extends React.ElementType = "div"
> = MergeElementProps<T, BaseProps<P, T>>;

declare const Snackbar: (props: SnackbarProps) => JSX.Element;

export default Snackbar;
