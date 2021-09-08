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
   * If `true`, the Snackbar automatically closes after a calculated time.
   * This calculated time depends on the number of characters in the Snackbar's content.
   *
   * If a number is entered, the Snackbar will be closed after that amount of time (in miliseconds).
   * @default false
   */
  autoHide?: number | boolean;
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
   * The Callback fires when the close button is clicked.
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
  onTransitionEnd?: (event: React.TransitionEvent<HTMLDivElement>) => void;
};

export type SnackbarProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const Snackbar: (props: SnackbarProps) => JSX.Element;

export default Snackbar;
