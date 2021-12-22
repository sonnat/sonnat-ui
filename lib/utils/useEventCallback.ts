/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

/**
 * A community-wide workaround for `useCallback()`.
 * Because the `useCallback()` hook invalidates too often in practice.
 *
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 */
const useEventCallback = <T extends (...args: any) => any>(
  fn: T
): ((...args: any) => void) => {
  const ref = React.useRef<T>(fn);

  useIsomorphicLayoutEffect(() => void (ref.current = fn));

  return React.useCallback((...args: any) => void ref.current(...args), []);
};

export default useEventCallback;
