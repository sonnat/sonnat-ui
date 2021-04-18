import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The text to display. */
  text?: string;
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
   * The icon placed before the text.
   * The component will use it as a `sonnat-icon` identifier.
   */
  icon?: string;
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

export type SnackbarProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface SnackbarFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: SnackbarProps<P>): JSX.Element;
}

declare const Snackbar: SnackbarFC<{}>;

export default Snackbar;
