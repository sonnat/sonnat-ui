export default function closest(element, selector) {
  if (Element.prototype.closest) return element.closest(selector);
  else {
    // Polyfill for IE9+
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        Element.prototype.msMatchesSelector ||
        Element.prototype.webkitMatchesSelector;
    }

    Element.prototype.closest = function (s) {
      let el = this;

      do {
        if (el.matches(s)) return el;
        el = el.parentElement || el.parentNode;
      } while (el !== null && el.nodeType === 1);
      return null;
    };

    return element.closest(selector);
  }
}
