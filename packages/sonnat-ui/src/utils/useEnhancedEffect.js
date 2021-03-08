import { useEffect, useLayoutEffect } from "react";

const noopFn = () => {};

export default function useEnhancedEffect(
  effectCallback = noopFn,
  dependencies
) {
  return (typeof window !== "undefined" ? useLayoutEffect : useEffect)(
    effectCallback,
    dependencies
  );
}
