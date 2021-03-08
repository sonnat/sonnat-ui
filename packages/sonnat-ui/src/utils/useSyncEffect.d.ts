import { EffectCallback, DependencyList } from "react";

/**
 *
 * @function useSyncEffect
 *
 * @param {EffectCallback} effectCallback
 * Imperative function that can return a cleanup function.
 *
 * @param {DependencyList} dependencies
 * If present, effect will only activate if the values in the list change.
 *
 */
export default function useSyncEffect(
  /* eslint-disable no-unused-vars */
  effectCallback: EffectCallback,
  dependencies?: DependencyList
  /* eslint-enable no-unused-vars */
): void;
