/**
 * Maps the value `number` from range `[min, max]` to range `[rMin, rMax]`.
 *
 * @function map
 *
 * @param {number} number The value to be mapped.
 * @param {number} min The start of the first range.
 * @param {number} max The end of the first range.
 * @param {number} rMin The start of the second range.
 * @param {number} rMax - The end of the second range.
 * @param {boolean} [withinBounds = false] If set to `true`, the mapped value will also be clamped to the second range.
 *
 * @returns {number} The mapped value.
 */
export default function map(
  /* eslint-disable no-unused-vars */
  number: number,
  min: number,
  max: number,
  rMin: number,
  rMax: number,
  withinBounds?: boolean = false
  /* eslint-enable no-unused-vars */
): number;
