const getVar = <T>(
  variable: T,
  fallback: NonNullable<T>,
  condition = true
): NonNullable<T> =>
  variable == null || condition ? fallback : (variable as NonNullable<T>);

export default getVar;
