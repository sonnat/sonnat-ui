import React, { useState } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import {
  useForkRef,
  setRef,
  HTMLElementType,
  useEnhancedEffect
} from "../utils";

const componentName = "Portal";

function getContainer(container) {
  const __container = typeof container === "function" ? container() : container;
  // eslint-disable-next-line react/no-find-dom-node
  return ReactDOM.findDOMNode(__container);
}

const Portal = React.forwardRef(function Portal(
  { children, activate = true, container },
  ref
) {
  const [mountNode, setMountNode] = useState(null);
  const handleRef = useForkRef(
    React.isValidElement(children) ? children.ref : null,
    ref
  );

  useEnhancedEffect(() => {
    if (activate) setMountNode(getContainer(container) || document.body);
  }, [container, activate]);

  useEnhancedEffect(() => {
    if (mountNode && activate) {
      setRef(ref, mountNode);
      return () => {
        setRef(ref, null);
      };
    }

    return undefined;
  }, [ref, mountNode, activate]);

  if (!activate) {
    if (React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref: handleRef
      });
    }
    return children;
  }

  return mountNode ? ReactDOM.createPortal(children, mountNode) : mountNode;
});

Portal.displayName = componentName;

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
