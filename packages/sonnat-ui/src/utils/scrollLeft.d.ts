/**
 * Based on the jquery plugin https://github.com/othree/jquery.rtl-scroll-type
 *
 * Types of scrollLeft, assuming scrollWidth=100 and direction is rtl.
 *
 * Type             | <- Most Left | Most Right -> | Initial
 * ---------------- | ------------ | ------------- | -------
 * default          | 0            | 100           | 100
 * negative (spec*) | -100         | 0             | 0
 * reverse          | 100          | 0             | 0
 *
 * Edge 85: default
 * Safari 14: negative
 * Chrome 85: negative
 * Firefox 81: negative
 * IE11: reverse
 *
 * Spec: https://drafts.csswg.org/cssom-view/#dom-window-scroll
 *
 * @function detectScrollType
 *
 * @returns {string} Returns the string represents the scrollLeft type.
 *
 */
export function detectScrollType(): string;

/**
 * Based on https://stackoverflow.com/a/24394376
 *
 * @function getNormalizedScrollLeft
 *
 * @param {HTMLElement} element - The target element.
 * @param {'rtl' | 'ltr'} direction - The document direction.
 *
 * @returns {number} Returns the normalized value of the scrollLeft property.
 */
export default function getNormalizedScrollLeft(
  /* eslint-disable no-unused-vars */
  element: HTMLElement,
  direction: "rtl" | "ltr"
  /* eslint-enable no-unused-vars */
): number;
