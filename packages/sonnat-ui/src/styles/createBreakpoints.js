export const keys = ["xxs", "xs", "sm", "md", "lg", "xlg"];

export default breakpoints => {
  const {
    values = {
      xxs: 320,
      xs: 520,
      sm: 768,
      md: 960,
      lg: 1024,
      xlg: 1366
    },
    unit = "px",
    step = 5
  } = breakpoints;

  const up = key => {
    const value = typeof values[key] === "number" ? values[key] : key;
    return `@media (min-width:${value}${unit})`;
  };

  const down = key => {
    const index = keys.indexOf(key);

    if (index === keys.length - 1) return up("xxs");

    const value = typeof values[key] === "number" ? values[key] : key;
    return `@media (max-width:${value - step / 100}${unit})`;
  };

  const between = (startKey, endKey) => {
    const endIndex = keys.indexOf(endKey);

    if (endIndex === keys.length - 1) return up(startKey);

    const minVal =
      typeof values[startKey] === "number" ? values[startKey] : startKey;
    const maxVal =
      endIndex !== -1 && typeof values[keys[endIndex]] === "number"
        ? values[keys[endIndex]]
        : endKey;

    return (
      `@media (min-width:${minVal}${unit}) and ` +
      `(max-width:${maxVal - step / 100}${unit})`
    );
  };

  const width = key => values[key];

  return {
    keys,
    values,
    up,
    down,
    between,
    width
  };
};
