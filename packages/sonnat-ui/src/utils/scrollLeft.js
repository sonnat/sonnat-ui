// This file is mainly forked from
// https://github.com/mui-org/material-ui/blob/64908fa7a3d9670ff16fc4a57b8f814e98ac0e99/packages/material-ui/src/utils/scrollLeft.js#L59

// Source from https://github.com/alitaheri/normalize-scroll-left
let cachedType;

export function detectScrollType() {
  if (cachedType) return cachedType;

  const dummy = document.createElement("div");
  const container = document.createElement("div");

  container.style.width = "10px";
  container.style.height = "1px";

  dummy.appendChild(container);
  dummy.dir = "rtl";
  dummy.style.fontSize = "14px";
  dummy.style.width = "4px";
  dummy.style.height = "1px";
  dummy.style.position = "absolute";
  dummy.style.top = "-1000px";
  dummy.style.overflow = "scroll";

  document.body.appendChild(dummy);

  cachedType = "reverse";

  if (dummy.scrollLeft > 0) {
    cachedType = "default";
  } else {
    dummy.scrollLeft = 1;
    if (dummy.scrollLeft === 0) {
      cachedType = "negative";
    }
  }

  document.body.removeChild(dummy);
  return cachedType;
}

export function getNormalizedScrollLeft(element, direction) {
  const scrollLeft = element.scrollLeft;

  // Perform the calculations only when direction is rtl to avoid messing up the ltr behavior
  if (direction === "ltr") return scrollLeft;

  const type = detectScrollType();

  switch (type) {
    case "negative":
      return element.scrollWidth - element.clientWidth + scrollLeft;
    case "reverse":
      return element.scrollWidth - element.clientWidth - scrollLeft;
    default:
      return scrollLeft;
  }
}
