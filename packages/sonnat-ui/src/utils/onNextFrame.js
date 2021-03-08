export default function onNextFrame(callback) {
  if (typeof window === "undefined") return;
  setTimeout(() => requestAnimationFrame(callback));
}
