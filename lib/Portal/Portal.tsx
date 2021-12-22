import PropTypes from "prop-types";
import * as React from "react";
import ReactDOM from "react-dom";
import { HTMLElementType, setRef, useIsomorphicLayoutEffect } from "../utils";

export interface PortalProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * An HTML element or function that returns one.
   * The `container` will have the portal children appended to it.
   *
   * By default, it uses the body of the top-level document object,
   * so it's simply `document.body` most of the time.
   */
  container?: null | HTMLElement | (() => HTMLElement);
  /**
   * If `false`, the teleportation will be deactivated.
   * @default true
   */
  activate?: boolean;
}

const Portal = (
  props: PortalProps,
  ref: React.Ref<HTMLElement>
): JSX.Element | null => {
  const { children, activate = true, container } = props;

  const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);

  const childRef = React.isValidElement(children)
    ? (children as { ref?: React.Ref<HTMLElement> }).ref
    : null;

  useIsomorphicLayoutEffect(() => {
    if (activate) {
      const containerEl =
        typeof container === "function" ? container() : container;

      setMountNode(containerEl || document.body);
    }
  }, [container, activate]);

  useIsomorphicLayoutEffect(() => {
    if (mountNode && activate) {
      setRef(ref, mountNode);
      return () => void setRef(ref, null);
    }

    return undefined;
  }, [ref, mountNode, activate]);

  if (!activate) {
    return React.isValidElement(children)
      ? React.cloneElement(children, {
          ref: (node: HTMLElement | null) => {
            setRef(ref, node);
            if (childRef) setRef(childRef, node);
          }
        })
      : null;
  }

  return mountNode ? ReactDOM.createPortal(children, mountNode) : null;
};

Portal.propTypes = {
  children: PropTypes.node,
  container: PropTypes.oneOfType([
    HTMLElementType,
    PropTypes.instanceOf(React.Component),
    PropTypes.func
  ]),
  activate: PropTypes.bool
};

export default Portal;
