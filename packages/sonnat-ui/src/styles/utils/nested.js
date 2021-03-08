const hasSymbol = typeof Symbol === "function" && Symbol.for;

export default hasSymbol ? Symbol.for("sonnat.nested") : "__THEME_NESTED__";
