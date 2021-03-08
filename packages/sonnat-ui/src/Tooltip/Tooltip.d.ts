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
  text: string;
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
   * @default true
   */
  tailed?: boolean;
  /**
   * 	If `true`, the tooltip will be dark.
   * @default true
   */
  dark?: boolean;
  /**
   * 	If `true`, the tooltip will be open.
   * @default true
   */
  open?: boolean;
  /**
   * 	If `true`, the tooltip will be open on mount. Use when the component is not controlled.
   * @default true
   */
  defaultOpen?: boolean;
};

export type TooltipProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface TooltipFC<P> {
  // eslint-disable-next-line no-unused-vars
  (props: TooltipProps<P>): JSX.Element;
}

declare const Tooltip: TooltipFC<{}>;

export default Tooltip;
