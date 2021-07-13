export default function getVar(variable, fallback, condition) {
  const baseCondition = variable == null;
  const returnStatement = baseCondition ? fallback : variable;

  if (condition) return returnStatement;
  else return returnStatement;
}
