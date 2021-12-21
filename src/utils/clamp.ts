const clamp = (number: number, min: number, max: number): number =>
  Math.max(Math.min(number, max), min);

export default clamp;
