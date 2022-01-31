import React from "react";

type UseIntersectionObserverInit = Pick<IntersectionObserverInit, "rootMargin">;
type UseIntersection = { disabled?: boolean } & UseIntersectionObserverInit;
type ObserveCallback = (isVisible: boolean) => void;
type Observer = {
  id: string;
  observer: IntersectionObserver;
  elements: Map<HTMLElement, ObserveCallback>;
};

const requestIdleCallback =
  (typeof self !== "undefined" &&
    self.requestIdleCallback &&
    self.requestIdleCallback.bind(window)) ||
  function (cb: IdleRequestCallback): number {
    const start = Date.now();
    return setTimeout(function () {
      cb({
        didTimeout: false,
        timeRemaining: function () {
          return Math.max(0, 50 - (Date.now() - start));
        }
      });
    }, 1) as unknown as number;
  };

const cancelIdleCallback =
  (typeof self !== "undefined" &&
    self.cancelIdleCallback &&
    self.cancelIdleCallback.bind(window)) ||
  function (id: number) {
    return clearTimeout(id);
  };

const hasIntersectionObserver = typeof IntersectionObserver !== "undefined";

const observers = new Map<string, Observer>();

const observe = <T extends HTMLElement = HTMLElement>(
  element: T,
  callback: ObserveCallback,
  options: UseIntersectionObserverInit
): (() => void) => {
  const { id, observer, elements } = createObserver(options);

  elements.set(element, callback);
  observer.observe(element);

  const unobserve = () => {
    elements.delete(element);
    observer.unobserve(element);

    // Destroy observer when there's nothing left to watch:
    if (elements.size === 0) {
      observer.disconnect();
      observers.delete(id);
    }
  };

  return unobserve;
};

const createObserver = (options: UseIntersectionObserverInit): Observer => {
  const id = options.rootMargin || "";
  let instance = observers.get(id);

  if (instance) return instance;

  const elements = new Map<HTMLElement, ObserveCallback>();

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const callback = elements.get(<HTMLElement>entry.target);
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

/**
 * Cherry-picked from https://github.com/vercel/next.js/blob/canary/packages/next/client/use-intersection.tsx
 */
const useIntersection = <T extends HTMLElement = HTMLElement>({
  rootMargin,
  disabled
}: UseIntersection): [(element: T | null) => void, boolean] => {
  const isDisabled = disabled || !hasIntersectionObserver;

  const unobserve = React.useRef<() => void>();
  const [visible, setVisible] = React.useState(false);

  const setRef = React.useCallback(
    (el: T | null) => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
};

export default useIntersection;
