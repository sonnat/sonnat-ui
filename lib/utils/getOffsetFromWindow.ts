const getOffsetFromWindow = <T extends HTMLElement = HTMLElement>(
  element: T
): { top: number; left: number } => {
  let topDistance = 0;
  let leftDistance = 0;

  do {
    topDistance += element.offsetTop;
    leftDistance += element.offsetLeft;

    element = element.offsetParent as T;
  } while (element);

  return {
    top: topDistance < 0 ? 0 : topDistance,
    left: leftDistance < 0 ? 0 : leftDistance
  };
};

export default getOffsetFromWindow;
