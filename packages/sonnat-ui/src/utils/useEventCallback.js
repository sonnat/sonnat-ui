import * as React from "react";
import useEnhancedEffect from "./useEnhancedEffect";

/**
 * A community-wide workaround for `useCallback()`.
 * Because the `useCallback()` hook invalidates too often in practice.
 *
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 */
export default function useEnhancedCallback(fn) {
  const ref = React.useRef(fn);

  useEnhancedEffect(() => {
    ref.current = fn;
  });

  return React.useCallback((...args) => (0, ref.current)(...args), []);
}
