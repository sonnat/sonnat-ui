import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * The tooltip will be added relative to this node.
   */
  children: React.ReactElement;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The text content of the tooltip.
   */
  text?: string;
  /**
   * Tooltip placement. It will be auto updated when it collide with the window.
   * @default "top"
   */
  placement?: "left" | "right" | "top" | "bottom";
  /**
   * 	The tooltip will be triggered by this event.
   * @default "hover"
   */
  triggersOn?: "hover" | "click" | "mouseMove";
  /**
   * 	If `true`, the tooltip will have an arrow tail.
   * @default false
   */
  tailed?: boolean;
  /**
   * 	If `true`, the tooltip will be open.
   */
  open?: boolean;
  /**
   * 	If `true`, the tooltip will be open on mount. Use when the component is not controlled.
   */
  defaultOpen?: boolean;
  /**
   * The Callback fires when user has clicked outside of the tooltip.
   *
   * @param {React.MouseEvent<HTMLElement, MouseEvent>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onOutsideClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  /**
   * The Callback fires when the component requests to be closed.
   *
   * @param {object} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onClose?: (event: React.SyntheticEvent | Event) => void;
  /**
   * The Callback fires when the component requests to be opened.
   *
   * @param {object} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onOpen?: (event: React.SyntheticEvent | Event) => void;
};

export type TooltipProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface TooltipFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: TooltipProps<P>): JSX.Element;
}

declare const Tooltip: TooltipFC<{}>;

export default Tooltip;
