export default function clamp(number, min, max) {
  return Math.max(Math.min(number, max), min);
}
