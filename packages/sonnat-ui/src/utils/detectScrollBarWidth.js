export default function detectScrollBarWidth() {
  const scrollDiv = document.createElement("div");
  scrollDiv.style.width = 100;
  scrollDiv.style.height = 100;
  scrollDiv.style.overflow = "scroll";
  scrollDiv.style.position = "absolute";
  scrollDiv.style.top = -9999;

  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);

  return scrollbarWidth;
}
