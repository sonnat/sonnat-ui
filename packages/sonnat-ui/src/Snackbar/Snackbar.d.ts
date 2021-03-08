import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The text to display. */
  text: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The text to display on the Undo Button.
   */
  undoButtonLabel?: string;
  /**
   * The icon placed before the text.
   * The component will use it as a `sonnat-icon` identifier.
   */
  icon?: string;
  /**
   * The horizontal position of the Snackbar.
   * @default "center"
   */
  horizontalPosition?: "left" | "center" | "right";
  /**
   * The vertical position of the Snackbar.
   * @default "bottom"
   */
  verticalPosition?: "top" | "bottom";
  /**
   * If `true`, the component will be open.
   * @default false
   */
  open?: boolean;
  /**
   * If `true`, the Snackbar will have Close Button.
   * @default false
   */
  closable?: boolean;
  /**
   * If `true`, the Snackbar will have Undo Button.
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

export type SnackbarProps<P> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface SnackbarFC<P> {
  // eslint-disable-next-line no-unused-vars
  (props: SnackbarProps<P>): JSX.Element;
}

declare const Snackbar: SnackbarFC<{}>;

export default Snackbar;
