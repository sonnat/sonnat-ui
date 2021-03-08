export default function wrap(number, min, max) {
  return min + ((((number - min) % (max - min)) + (max - min)) % (max - min));
}
