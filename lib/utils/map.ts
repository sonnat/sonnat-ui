import clamp from "./clamp";

const map = (
  number: number,
  min: number,
  max: number,
  rMin: number,
  rMax: number,
  withinBounds = false
): number => {
  const mappedVal = ((number - min) * (rMax - rMin)) / (max - min) + rMin;

  if (!withinBounds) return mappedVal;
  else if (rMax > rMin) return clamp(mappedVal, rMin, rMax);
  else return clamp(mappedVal, rMax, rMin);
};

export default map;
