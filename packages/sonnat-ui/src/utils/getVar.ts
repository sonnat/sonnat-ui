import type { NotUndefined } from "../typings";

const getVar = <T>(
  variable: T,
  fallback: NotUndefined<T>,
  condition?: boolean
): T => {
  const baseCondition = variable == null;
  const returnStatement = baseCondition ? fallback : variable;

  if (condition) return returnStatement;
  else return returnStatement;
};

export default getVar;
