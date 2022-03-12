// This file is cherry-picked from https://floating-ui.com/

import type { RequireOnlyOne } from "../typings";
import {
  contains,
  getBoundingClientRect,
  getDocumentElement,
  getNodeName,
  getOffsetParent,
  getParentNode,
  getViewportRect,
  getWindow,
  isElement,
  isHTMLElement,
  isOverflowElement,
  isWindow,
  type ClientRect
} from "../utils";

export type Alignment = "start" | "end";
export type Side = "top" | "right" | "bottom" | "left";
export type AlignedPlacement = `${Side}-${Alignment}`;
export type Placement = Side | AlignedPlacement;

export type Strategy = "absolute" | "fixed";

export type Coordinates = { x: number; y: number };
export type Dimensions = { width: number; height: number };

export type Rect = Coordinates & Dimensions;
export type ElementRects = { anchorRect: Rect; popperRect: Rect };
export type VirtualElement = { getBoundingClientRect(): ClientRect };
export type Elements = {
  anchorElement: HTMLElement | VirtualElement;
  popperElement: HTMLDivElement;
};

export type OffsetMiddleware =
  | number
  | {
      /**
       * The axis that runs along the side of the popper element.
       */
      mainAxis?: number;
      /**
       * The axis that runs along the alignment of the popper element.
       */
      crossAxis?: number;
    };

export type AutoPlacementMiddleware = boolean | { excludeSides: Side[] };

type MiddlewareResult = RequireOnlyOne<{
  coordinates: Partial<Coordinates>;
  placement: Placement;
}>;

export type ComputationMiddlewareArgs = {
  elementRects: ElementRects;
  elements: Elements;
  coordinates: Coordinates;
  placement: Placement;
};
export type ComputationMiddlewareResult = MiddlewareResult;
export type ComputationMiddlewareOrder =
  | "beforeAutoPlacement"
  | "afterAutoPlacement";
export type ComputationMiddleware = (
  args: ComputationMiddlewareArgs
) => ComputationMiddlewareResult;

export type ComputationResult = Coordinates & { placement: Placement };

export const sides = ["top", "right", "bottom", "left"] as const;
export const alignments = ["end", "start"] as const;
export const strategies = ["absolute", "fixed"] as const;

const allPlacements: Readonly<Placement[]> = sides.reduce(
  (result, side) => [...result, side, `${side}-start`, `${side}-end`],
  [] as Placement[]
);

const getSideFromPlacement = (placement: Placement): Side =>
  placement.split("-")[0] as Side;

const getMainAxisFromPlacement = (placement: Placement): keyof Coordinates =>
  ["top", "bottom"].includes(getSideFromPlacement(placement)) ? "x" : "y";

const getLengthFromAxis = (axis: keyof Coordinates): keyof Dimensions =>
  axis === "y" ? "height" : "width";

const getAlignmentFromPlacement = (
  placement: Placement
): Alignment | undefined => placement.split("-")[1] as Alignment | undefined;

const getAlignmentSidesFromPlacement = (
  placement: Placement,
  elementRects: ElementRects,
  isRtl: boolean
): { mainSide: Side; crossSide: Side } => {
  const alignment = getAlignmentFromPlacement(placement);
  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);

  const _getOppositeSide = (side: Side) =>
    side.replace(
      /left|right|bottom|top/g,
      matched =>
        ({ left: "right", right: "left", top: "bottom", bottom: "top" }[
          matched
        ] ?? "")
    ) as Side;

  let mainSide: Side =
    mainAxis === "x"
      ? alignment === (isRtl ? "end" : "start")
        ? "right"
        : "left"
      : alignment === "start"
      ? "bottom"
      : "top";

  if (elementRects.anchorRect[length] > elementRects.popperRect[length])
    mainSide = _getOppositeSide(mainSide);

  return { mainSide, crossSide: _getOppositeSide(mainSide) };
};

const getDocumentRect = (element: HTMLElement): Rect => {
  const window = getWindow(element);
  const html = getDocumentElement(element);
  const scroll = getScrollProps(element);
  const body = element.ownerDocument?.body;

  const width = Math.max(
    html.scrollWidth,
    html.clientWidth,
    body ? body.scrollWidth : 0,
    body ? body.clientWidth : 0
  );

  const height = Math.max(
    html.scrollHeight,
    html.clientHeight,
    body ? body.scrollHeight : 0,
    body ? body.clientHeight : 0
  );

  let x = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y = -scroll.scrollTop;

  if (window.getComputedStyle(body || html).direction === "rtl") {
    x += Math.max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }

  return { width, height, x, y };
};

const getClippingRect = (element: Element): Rect => {
  const _getNearestOverflowAncestor = (node: Node): HTMLElement | null => {
    const parentNode = getParentNode(node);

    if (["html", "body", "#document"].includes(getNodeName(parentNode)))
      return node.ownerDocument ? node.ownerDocument.body : null;

    if (isHTMLElement(parentNode) && isOverflowElement(parentNode))
      return parentNode;

    return _getNearestOverflowAncestor(parentNode);
  };

  const _getOverflowAncestors = (
    node: Node,
    list: (Element | Window | VisualViewport)[] = []
  ): typeof list => {
    const scrollableAncestor = _getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === node.ownerDocument?.body;
    const window = getWindow(scrollableAncestor as Node);

    const target = isBody
      ? (<(Element | Window | VisualViewport)[]>[window]).concat(
          window.visualViewport ?? [],
          isOverflowElement(scrollableAncestor) ? scrollableAncestor : []
        )
      : scrollableAncestor ?? [];

    const updatedList = list.concat(target);

    return isBody
      ? updatedList
      : updatedList.concat(
          _getOverflowAncestors(getParentNode(target as HTMLElement))
        );
  };

  /**
   * A "clipping ancestor" is an overflowable container with the characteristic of
   * clipping (or hiding) overflowing elements with a position different from `initial`.
   */
  const _getClippingAncestors = (element: Element): Element[] => {
    const clippingAncestors = _getOverflowAncestors(element);
    const window = getWindow(element);
    const canEscapeClipping = ["absolute", "fixed"].includes(
      window.getComputedStyle(element).position
    );

    const clipperElement =
      canEscapeClipping && isHTMLElement(element)
        ? getOffsetParent(element)
        : element;

    if (!isElement(clipperElement)) return [];

    return clippingAncestors.filter(
      ancestor =>
        isElement(ancestor) &&
        contains(ancestor, clipperElement) &&
        getNodeName(ancestor) !== "body"
    ) as Element[];
  };

  const _getInnerBoundingClientRect = (element: Element): ClientRect => {
    const clientRect = getBoundingClientRect(element);

    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;

    return {
      top,
      left,
      x: left,
      y: top,
      right: left + element.clientWidth,
      bottom: top + element.clientHeight,
      width: element.clientWidth,
      height: element.clientHeight
    };
  };

  const _getClientRectFromClippingAncestor = (
    element: Element,
    clippingParent: Element | "viewport"
  ): ClientRect => {
    if (clippingParent === "viewport")
      return rectToClientRect(getViewportRect(element));

    if (isElement(clippingParent))
      return _getInnerBoundingClientRect(clippingParent);

    return rectToClientRect(getDocumentRect(getDocumentElement(element)));
  };

  const clippingAncestors = [
    ..._getClippingAncestors(element),
    "viewport" as const
  ];

  const firstClippingAncestor = clippingAncestors[0];

  const clippingRect = clippingAncestors.reduce((result, clippingAncestor) => {
    const rect = _getClientRectFromClippingAncestor(element, clippingAncestor);

    result.top = Math.max(rect.top, result.top);
    result.right = Math.min(rect.right, result.right);
    result.bottom = Math.min(rect.bottom, result.bottom);
    result.left = Math.max(rect.left, result.left);

    return result;
  }, _getClientRectFromClippingAncestor(element, firstClippingAncestor));

  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
};

const rectToClientRect = (rect: Rect): ClientRect => ({
  ...rect,
  top: rect.y,
  left: rect.x,
  right: rect.x + rect.width,
  bottom: rect.y + rect.height
});

const getOffsetParentRectRelativeToViewport = (args: {
  popperRect: ElementRects["popperRect"];
  offsetParent: ReturnType<typeof getOffsetParent>;
  strategy: Strategy;
}): Rect => {
  const { popperRect, offsetParent, strategy } = args;

  const documentElement = getDocumentElement(offsetParent);
  if (offsetParent === documentElement) return popperRect;

  const isOffsetParentAHTMLElement = isHTMLElement(offsetParent);

  let scroll = { scrollLeft: 0, scrollTop: 0 };
  const offset = { x: 0, y: 0 };

  if (
    isOffsetParentAHTMLElement ||
    (!isOffsetParentAHTMLElement && strategy !== "fixed")
  ) {
    if (
      getNodeName(offsetParent) !== "body" ||
      isOverflowElement(documentElement)
    )
      scroll = getScrollProps(offsetParent);

    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offset.x = offsetRect.x + offsetParent.clientLeft;
      offset.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) offset.x = getWindowScrollBarX(documentElement);
  }

  return {
    ...popperRect,
    x: popperRect.x - scroll.scrollLeft + offset.x,
    y: popperRect.y - scroll.scrollTop + offset.y
  };
};

const getScrollProps = (element: Element | Window) => {
  if (isWindow(element)) {
    return {
      scrollLeft: element.scrollX || element.pageXOffset,
      scrollTop: element.scrollY || element.pageYOffset
    };
  }

  return { scrollLeft: element.scrollLeft, scrollTop: element.scrollTop };
};

const getWindowScrollBarX = (element: Element): number => {
  // If <html> has a CSS width greater than the viewport,
  // then this will be incorrect for RTL.
  return (
    getBoundingClientRect(getDocumentElement(element)).left +
    getScrollProps(element).scrollLeft
  );
};

const getRectRelativeToOffsetParent = (
  element: HTMLElement | VirtualElement,
  offsetParent: Element | Window,
  strategy: Strategy
): Rect => {
  const isOffsetParentAHTMLElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);

  const _isScaled = (element: HTMLElement): boolean => {
    const clientRect = getBoundingClientRect(element);

    return (
      Math.round(clientRect.width) !== element.offsetWidth ||
      Math.round(clientRect.height) !== element.offsetHeight
    );
  };

  const rect = getBoundingClientRect(
    element,
    isOffsetParentAHTMLElement && _isScaled(offsetParent)
  );

  let scroll = { scrollLeft: 0, scrollTop: 0 };
  const offset = { x: 0, y: 0 };

  if (
    isOffsetParentAHTMLElement ||
    (!isOffsetParentAHTMLElement && strategy !== "fixed")
  ) {
    if (
      getNodeName(offsetParent) !== "body" ||
      isOverflowElement(documentElement)
    )
      scroll = getScrollProps(offsetParent);

    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent, true);
      offset.x = offsetRect.x + offsetParent.clientLeft;
      offset.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) offset.x = getWindowScrollBarX(documentElement);
  }

  return {
    x: rect.left + scroll.scrollLeft - offset.x,
    y: rect.top + scroll.scrollTop - offset.y,
    width: rect.width,
    height: rect.height
  };
};

const getElementRects = (
  elements: Elements,
  strategy: Strategy
): ElementRects => ({
  anchorRect: getRectRelativeToOffsetParent(
    elements.anchorElement,
    getOffsetParent(elements.popperElement),
    strategy
  ),
  popperRect: {
    x: 0,
    y: 0,
    width: elements.popperElement.offsetWidth,
    height: elements.popperElement.offsetHeight
  }
});

const calcCoordinatesFromPlacement = (
  placement: Placement,
  offset: OffsetMiddleware,
  elementRects: ElementRects,
  isRtl: boolean
): Coordinates => {
  const { anchorRect, popperRect } = elementRects;

  const commonX = anchorRect.x + (anchorRect.width - popperRect.width) / 2;
  const commonY = anchorRect.y + (anchorRect.height - popperRect.height) / 2;

  const mainAxis = getMainAxisFromPlacement(placement);
  const length = getLengthFromAxis(mainAxis);

  const commonAlign = (anchorRect[length] - popperRect[length]) / 2;

  const side = getSideFromPlacement(placement);
  const alignment = getAlignmentFromPlacement(placement);

  const isVertical = mainAxis === "x";

  let coordinates: Coordinates;
  switch (side) {
    case "top":
      coordinates = { x: commonX, y: anchorRect.y - popperRect.height };
      break;
    case "bottom":
      coordinates = { x: commonX, y: anchorRect.y + anchorRect.height };
      break;
    case "left":
      coordinates = { x: anchorRect.x - popperRect.width, y: commonY };
      break;
    case "right":
      coordinates = { x: anchorRect.x + anchorRect.width, y: commonY };
      break;
    default:
      coordinates = { x: anchorRect.x, y: anchorRect.y };
  }

  switch (alignment) {
    case "start":
      coordinates[mainAxis] -= commonAlign * (isRtl && isVertical ? -1 : 1);
      break;
    case "end":
      coordinates[mainAxis] += commonAlign * (isRtl && isVertical ? -1 : 1);
      break;
    default:
  }

  const mainAxisCoef = ["left", "top"].includes(side) ? -1 : 1;
  let crossAxisCoef = 1;
  if (alignment === "end") crossAxisCoef = -1;
  if (isRtl && isVertical) crossAxisCoef *= -1;

  let mainAxisOffset = 0;
  let crossAxisOffset = 0;

  if (typeof offset === "number") {
    mainAxisOffset = offset;
  } else if (typeof offset === "object") {
    const { crossAxis = 0, mainAxis = 0 } = offset;

    mainAxisOffset = mainAxis;
    crossAxisOffset = crossAxis;
  }

  const diffCoordinates = isVertical
    ? { x: crossAxisOffset * crossAxisCoef, y: mainAxisOffset * mainAxisCoef }
    : { x: mainAxisOffset * mainAxisCoef, y: crossAxisOffset * crossAxisCoef };

  return {
    x: coordinates.x + diffCoordinates.x,
    y: coordinates.y + diffCoordinates.y
  };
};

/**
 * Resolves with an object of overflow side offsets that determine how much the
 * element is overflowing clipping boundary.
 *
 * - positive = overflowing the boundary by that number of pixels
 * - negative = how many pixels left before it will overflow
 * - 0 = lies flush with the boundary
 *
 * @see https://floating-ui.com/docs/detectOverflow
 */
const detectBoundaryOverflow = (args: {
  coordinates: Coordinates;
  elements: Elements;
  elementRects: ElementRects;
  strategy: Strategy;
}) => {
  const padding = 0;

  const element = args.elements.popperElement;

  const clippingRect = getClippingRect(element);
  const clientClippingRect = rectToClientRect(clippingRect);

  const elementClientRect = rectToClientRect(
    getOffsetParentRectRelativeToViewport({
      popperRect: {
        ...args.elementRects.popperRect,
        x: args.coordinates.x,
        y: args.coordinates.y
      },
      offsetParent: getOffsetParent(element),
      strategy: args.strategy
    })
  );

  return {
    top: clientClippingRect.top - elementClientRect.top + padding,
    bottom: elementClientRect.bottom - clientClippingRect.bottom + padding,
    left: clientClippingRect.left - elementClientRect.left + padding,
    right: elementClientRect.right - clientClippingRect.right + padding
  };
};

const suppressViewportOverflow = (
  excludeSides: Side[],
  args: {
    placement: Placement;
    coordinates: Coordinates;
    elements: Elements;
    elementRects: ElementRects;
    strategy: Strategy;
    isRtl: boolean;
  }
) => {
  const alignment = getAlignmentFromPlacement(args.placement);

  const _getOppositeAlignment = (placement: Placement) =>
    placement.replace(
      /start|end/g,
      matched => ({ start: "end", end: "start" }[matched] ?? "")
    ) as Placement;

  const _onlySides = (placement: Placement) =>
    getSideFromPlacement(placement) === placement;

  const _equalAlignments = (placement: Placement) =>
    getAlignmentFromPlacement(placement) === alignment;

  const _notEqualAlignments = (placement: Placement) =>
    getAlignmentFromPlacement(placement) !== alignment;

  const _oppositeAlignments = (placement: Placement) =>
    _getOppositeAlignment(placement) !== placement;

  const placements = allPlacements.filter(
    placement => !excludeSides.includes(getSideFromPlacement(placement))
  );

  const placementsSortedByAlignment = alignment
    ? [
        ...placements.filter(_equalAlignments),
        ...placements.filter(_notEqualAlignments)
      ].filter(
        placement =>
          _equalAlignments(placement) || _oppositeAlignments(placement)
      )
    : placements.filter(_onlySides);

  const overflow = detectBoundaryOverflow(args);

  const _findBestPlacement = (recursionData: {
    placementIndex: number;
    overflows: { placement: Placement; overflows: number[] }[];
  }): MiddlewareResult => {
    const { placementIndex, overflows } = recursionData;
    const currentPlacement = placementsSortedByAlignment[placementIndex];

    const { mainSide, crossSide } = getAlignmentSidesFromPlacement(
      currentPlacement,
      args.elementRects,
      args.isRtl
    );

    const currentOverflows = [
      overflow[getSideFromPlacement(currentPlacement)],
      overflow[mainSide],
      overflow[crossSide]
    ];

    const allOverflows = [
      ...overflows,
      { placement: currentPlacement, overflows: currentOverflows }
    ];

    const nextPlacementIndex = placementIndex + 1;
    const nextPlacement = placementsSortedByAlignment[nextPlacementIndex];

    // There are more placements to check
    if (nextPlacement) {
      return _findBestPlacement({
        overflows: allOverflows,
        placementIndex: nextPlacementIndex
      });
    }

    const placementsSortedByLeastOverflow = allOverflows
      .slice()
      .sort((a, b) => a.overflows[0] - b.overflows[0]);

    const placementThatFitsOnAllSides = placementsSortedByLeastOverflow.find(
      ({ overflows }) => overflows.every(overflow => overflow <= 0)
    )?.placement;

    return {
      placement:
        placementThatFitsOnAllSides ??
        placementsSortedByLeastOverflow[0].placement
    };
  };

  return _findBestPlacement({
    placementIndex: 0,
    overflows: []
  });
};

/**
 * Computes the `x` and `y` coordinates that will place the popper element
 * next to a anchor element when it is given a certain positioning strategy.
 */
export const computePosition = (
  anchorElement: HTMLElement | VirtualElement,
  popperElement: HTMLDivElement,
  config: {
    placement: Placement;
    strategy: Strategy;
    isRtl: boolean;
    autoPlacement: AutoPlacementMiddleware;
    offset: OffsetMiddleware;
    computationMiddleware?: ComputationMiddleware;
    computationMiddlewareOrder: ComputationMiddlewareOrder;
  }
): ComputationResult => {
  const {
    strategy,
    isRtl,
    autoPlacement,
    offset,
    placement: initialPlacement,
    computationMiddleware,
    computationMiddlewareOrder
  } = config;

  let placement = initialPlacement;

  const elements: Elements = { anchorElement, popperElement };
  const elementRects = getElementRects(elements, strategy);

  let { x, y } = calcCoordinatesFromPlacement(
    placement,
    offset,
    elementRects,
    isRtl
  );

  const middlewares = (
    computationMiddlewareOrder === "afterAutoPlacement"
      ? ["auto_placement", "custom_middleware"]
      : ["custom_middleware", "auto_placement"]
  ) as Readonly<("auto_placement" | "custom_middleware")[]>;

  middlewares.forEach(middleware => {
    let result: MiddlewareResult | undefined;

    const middlewareArg: ComputationMiddlewareArgs = {
      coordinates: { x, y },
      placement: placement,
      elements,
      elementRects
    };

    switch (middleware) {
      case "auto_placement": {
        if (autoPlacement) {
          const excludeSides =
            typeof autoPlacement === "object" ? autoPlacement.excludeSides : [];

          result = suppressViewportOverflow(excludeSides, {
            ...middlewareArg,
            strategy,
            isRtl
          });
        }
        break;
      }
      case "custom_middleware": {
        result = computationMiddleware?.(middlewareArg);
        break;
      }
      default:
    }

    if (result) {
      if (result.placement) {
        placement = result.placement ?? placement;
        ({ x, y } = calcCoordinatesFromPlacement(
          placement,
          offset,
          elementRects,
          isRtl
        ));
      } else ({ x = x, y = y } = result.coordinates);
    }
  });

  return { x, y, placement };
};
