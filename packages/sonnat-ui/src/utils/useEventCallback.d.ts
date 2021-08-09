/* eslint-disable no-unused-vars */

/**
 * A community-wide workaround for `useCallback()`.
 * Because the `useCallback()` hook invalidates too often in practice.
 *
 * https://github.com/facebook/react/issues/14099#issuecomment-440013892
 */
export default function useEnhancedCallback<
  T extends (...args: never[]) => unknown
>(fn: T): T;
