export default function getVar<T>(
  /** The input variable */
  variable: T,
  /** The fallback value */
  fallback: T,
  /**
   * The condition to check against the variable
   * If `true`, the function will return the fallback value,
   * Otherwise the variable's current value.
   */
  condition?: boolean
): T;
