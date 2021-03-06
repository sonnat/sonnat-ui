import * as React from "react";

type BaseProps<P = {}> = P & {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * An HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  // eslint-disable-next-line no-unused-vars
  container?: null | Element | ((element: Element) => Element);
  /**
   * If `false`, the teleportation will be deactivated.
   * @default true
   */
  activate?: boolean;
};

export type PortalProps<P = {}> = BaseProps<P>;

declare const Portal: (props: PortalProps) => JSX.Element;

export default Portal;
