import clamp from "./clamp";

export default function map(number, min, max, rMin, rMax, withinBounds) {
  const mappedVal = ((number - min) * (rMax - rMin)) / (max - min) + rMin;

  if (!withinBounds) return mappedVal;
  else if (rMax > rMin) return clamp(mappedVal, rMin, rMax);
  else return clamp(mappedVal, rMax, rMin);
}
