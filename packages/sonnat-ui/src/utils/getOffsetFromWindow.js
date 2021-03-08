export default function getOffsetFromWindow(element) {
  let topDistance = 0;
  let leftDistance = 0;

  do {
    topDistance += element.offsetTop;
    leftDistance += element.offsetLeft;
    element = element.offsetParent;
  } while (element);

  return {
    top: topDistance < 0 ? 0 : topDistance,
    left: leftDistance < 0 ? 0 : leftDistance
  };
}
