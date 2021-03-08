import fontIconVariables from "../styles/fontIconVariables.json";

const camelCase = s => s.replace(/-./g, x => x[1].toUpperCase());

export default function getIconVariableFromProp(identifierProp = "") {
  const __id = camelCase(identifierProp);

  return fontIconVariables[__id] || "";
}
