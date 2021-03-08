/**
 * Traverses the `element` and its parents (heading toward the document root)
 * until it finds a node that matches the provided `selector` string.
 * Will return itself or the matching ancestor. If no such element exists, it returns `null`.
 *
 * @function closest
 *
 * @param {Element} element Starting element.
 * @param {string} selector Is a `DOMString` containing a selector list.
 *
 * @return {Element} Returns the first (starting at element) inclusive ancestor that matches selectors,
 * and `null` otherwise.
 */
// eslint-disable-next-line no-unused-vars
export default function closest(element: Element, selector: string): Element;
