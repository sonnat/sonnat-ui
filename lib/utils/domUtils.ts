import { isContainingBlock, isHTMLElement, isShadowRoot, isWindow } from "./is";

export type ClientRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
};

export const getWindow = (node: Node | Window): Window => {
  if (!node) return window;

  if (!isWindow(node)) {
    const ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }

  return node;
};

export const getDocumentElement = (node: Node | Window): HTMLElement =>
  (
    (node instanceof getWindow(node).Node
      ? node.ownerDocument
      : node.document) ?? window.document
  ).documentElement;

export const getNodeName = (node: Node | Window): string =>
  isWindow(node) ? "" : node ? (node.nodeName || "").toLowerCase() : "";

export const getParentNode = (node: Node): Node => {
  if (getNodeName(node) === "html") return node;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return (
    // Step into the shadow DOM of the parent of a slotted node
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    node.assignedSlot ||
    // DOM Element detected
    node.parentNode ||
    // ShadowRoot detected
    (isShadowRoot(node) ? node.host : null) ||
    // Fallback
    getDocumentElement(node)
  );
};

export const getContainingBlock = (element: Element) => {
  let currentNode: Node | null = getParentNode(element);

  if (currentNode && isShadowRoot(currentNode)) currentNode = currentNode.host;

  while (
    isHTMLElement(currentNode) &&
    !["html", "body"].includes(getNodeName(currentNode))
  ) {
    if (isContainingBlock(currentNode)) return currentNode;
    else currentNode = currentNode.parentNode;
  }

  return null;
};

export const getOffsetParent = (element: Element) => {
  const window = getWindow(element);

  const _getSafeOffsetParent = (element: Element) => {
    if (
      !isHTMLElement(element) ||
      window.getComputedStyle(element).position === "fixed"
    )
      return null;

    return element.offsetParent;
  };

  let offsetParent = _getSafeOffsetParent(element);
  while (
    offsetParent &&
    ["table", "td", "th"].includes(getNodeName(offsetParent)) &&
    window.getComputedStyle(offsetParent).position === "static"
  ) {
    offsetParent = _getSafeOffsetParent(offsetParent);
  }

  if (
    offsetParent &&
    (getNodeName(offsetParent) === "html" ||
      (getNodeName(offsetParent) === "body" &&
        window.getComputedStyle(offsetParent).position === "static" &&
        !isContainingBlock(offsetParent)))
  ) {
    return window;
  }

  return offsetParent || getContainingBlock(element) || window;
};

export const getBoundingClientRect = (
  element: Element | { getBoundingClientRect: () => ClientRect },
  includeScale = false
) => {
  const clientRect = element.getBoundingClientRect();

  let scaleX = 1;
  let scaleY = 1;

  if (includeScale && isHTMLElement(element)) {
    scaleX =
      element.offsetWidth > 0
        ? Math.round(clientRect.width) / element.offsetWidth || 1
        : 1;
    scaleY =
      element.offsetHeight > 0
        ? Math.round(clientRect.height) / element.offsetHeight || 1
        : 1;
  }

  return {
    width: clientRect.width / scaleX,
    height: clientRect.height / scaleY,
    top: clientRect.top / scaleY,
    right: clientRect.right / scaleX,
    bottom: clientRect.bottom / scaleY,
    left: clientRect.left / scaleX,
    x: clientRect.left / scaleX,
    y: clientRect.top / scaleY
  };
};

export const getViewportRect = (element: Element) => {
  const window = getWindow(element);
  const html = getDocumentElement(element);

  const visualViewport = window.visualViewport;

  let width = html.clientWidth;
  let height = html.clientHeight;
  let x = 0;
  let y = 0;

  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;

    // Uses Layout Viewport (like Chrome; Safari does not currently)
    // In Chrome, it returns a value very close to 0 (+/-) but contains rounding
    // errors due to floating point numbers, so we need to check precision.
    // Safari returns a number <= 0, usually < -1 when pinch-zoomed
    if (
      Math.abs(
        window.innerWidth / visualViewport.scale - visualViewport.width
      ) < 0.01
    ) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }

  return { width, height, x, y };
};

export const contains = (parent: Element, child: Element): boolean => {
  const rootNode = child.getRootNode?.();

  if (parent.contains(child)) return true;

  // Fallback to custom implementation with Shadow DOM support
  if (rootNode && isShadowRoot(rootNode)) {
    let next = child;
    do {
      if (next && parent === next) return true;
      /* eslint-disable */
      // @ts-ignore
      next = next.parentNode || next.host;
      /* eslint-enable */
    } while (next);
  }

  return false;
};
