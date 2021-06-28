import type { EffectCallback, DependencyList } from "react";

/**
 *
 * @function useEnhancedEffect
 *
 * @param {EffectCallback} effectCallback
 * Imperative function that can return a cleanup function.
 *
 * @param {DependencyList} dependencies
 * If present, effect will only activate if the values in the list change.
 *
 */
export default function useEnhancedEffect(
  /* eslint-disable no-unused-vars */
  effectCallback: EffectCallback,
  dependencies?: DependencyList
  /* eslint-enable no-unused-vars */
): void;
