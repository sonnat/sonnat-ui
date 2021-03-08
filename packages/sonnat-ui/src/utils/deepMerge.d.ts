/**
 * Merge from source object to the target object.
 *
 * @function deepMerge
 *
 * @param {object} target The target object. (merge into)
 * @param {object} source The source object. (merge from)
 * @param {object} [options] The options object.
 * @param {boolean} [options.clone] If set to `true`, the output will be the cloned version of the `target`. (immutable)
 *
 * @return {object} Returns the merged version of the target.
 */
export default function deepMerge(
  /* eslint-disable no-unused-vars */
  target: object,
  source: object,
  options?: { clone?: boolean }
  /* eslint-enable no-unused-vars */
): object;
