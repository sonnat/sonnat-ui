/* eslint-disable */
export default function useIntersection<T extends Element>(
  rootMargin?: string,
  disabled?: boolean
): [(element: T | null) => void, boolean];
/* eslint-enable */
