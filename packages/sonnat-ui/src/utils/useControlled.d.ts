/**
 * forked from
 * https://github.com/mui-org/material-ui/blob/0d0e370c6e783f967fbd922ac925f576bee2b9ae/packages/material-ui/src/utils/useControlled.js
 *
 * originally forked from Material-UI with removed unnecessary things and
 * refactored few lines of codes.
 *
 * @function useControlled
 *
 * @param {T} controlledValue The value to be controlled.
 * @param {T} defaultValue The default value.
 * @param {string} componentName The name of the component is using this hook.
 *
 * @returns {[value: any, updater: (newValue: any) => void, isControlled: boolean]}
 * Returns a 3-tuple (triple) of the `value`,
 * the value `updater` callback, and the `isControlled` flag.
 */
/* eslint-disable */
export default function useControlled<T>(
  controlledValue: T,
  defaultValue: T,
  componentName: string
): [
  value: NonNullable<T>,
  updater: (value: NonNullable<T>) => void,
  isControlled: boolean
];
/* eslint-enable */
