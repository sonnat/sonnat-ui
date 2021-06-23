// cherry-picked from https://github.com/vercel/next.js/blob/canary/packages/next/client/use-intersection.tsx

import React from "react";

const requestIdleCallback =
  (typeof self !== "undefined" && self.requestIdleCallback) ||
  function (cb) {
    const start = Date.now();

    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1);
  };

const cancelIdleCallback =
  (typeof self !== "undefined" && self.cancelIdleCallback) ||
  function (id) {
    return clearTimeout(id);
  };

const hasIntersectionObserver = typeof IntersectionObserver !== "undefined";

const observers = new Map();

const observe = (element, callback, options) => {
  const { id, observer, elements } = createObserver(options);
  elements.set(element, callback);

  observer.observe(element);

  return function unobserve() {
    elements.delete(element);
    observer.unobserve(element);

    // Destroy observer when there's nothing left to watch:
    if (elements.size === 0) {
      observer.disconnect();
      observers.delete(id);
    }
  };
};

const createObserver = options => {
  const id = options.rootMargin || "";
  let instance = observers.get(id);

  if (instance) return instance;

  const elements = new Map();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const callback = elements.get(entry.target);
      const isVisible = entry.isIntersecting || entry.intersectionRatio > 0;
      if (callback && isVisible) {
        callback(isVisible);
      }
    });
  }, options);

  instance = {
    id,
    observer,
    elements
  };

  observers.set(id, instance);

  return instance;
};

export default function useIntersection(rootMargin, disabled = false) {
  const isDisabled = disabled || !hasIntersectionObserver;

  const unobserve = React.useRef();
  const [visible, setVisible] = React.useState(false);

  const setRef = React.useCallback(
    el => {
      if (unobserve.current) {
        unobserve.current();
        unobserve.current = undefined;
      }

      if (isDisabled || visible) return;

      if (el && el.tagName) {
        unobserve.current = observe(
          el,
          isVisible => isVisible && setVisible(isVisible),
          { rootMargin }
        );
      }
    },
    [isDisabled, rootMargin, visible]
  );

  React.useEffect(() => {
    if (!hasIntersectionObserver) {
      if (!visible) {
        const idleCallback = requestIdleCallback(() => setVisible(true));
        return () => cancelIdleCallback(idleCallback);
      }
    }
  }, [visible]);

  return [setRef, visible];
}
