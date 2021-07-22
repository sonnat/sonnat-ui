import * as React from "react";
import type { MergeElementProps } from "../typings";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The id of the element that describe the dialog.
   */
  "aria-describedby"?: string;
  /**
   * The id of the element that label the dialog.
   */
  "aria-labelledby"?: string;
  /**
   * A number in pixels which determines the `max-width` of the dialog.
   */
  maxWidth?: number;
  /**
   * If `true`, the dialog will be full-screen.
   * @default false
   */
  fullScreen?: boolean;
  /**
   * If `true`, the dialog will be open.
   * @default false
   */
  open?: boolean;
  /** The Callback fires when the dialog has opened. */
  onOpen?: () => void;
  /** The Callback fires when the dialog has closed. */
  onClose?: () => void;
  /** Callback fired when the backdrop is clicked. */
  onBackdropClick?: (
    // eslint-disable-next-line no-unused-vars
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => void;
  /** Callback fired when the `Escape` key is released. */
  onEscapeKeyUp?: (
    // eslint-disable-next-line no-unused-vars
    event: KeyboardEvent
  ) => void;
};

export type DialogProps<P = {}> = MergeElementProps<"div", BaseProps<P>>;

declare const Dialog: (props: DialogProps) => JSX.Element;

export default Dialog;
