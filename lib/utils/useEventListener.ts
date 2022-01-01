import * as React from "react";
import useLatest from "./useLatest";

type ElementEventListener<K extends keyof HTMLElementEventMap> = (
  this: HTMLElement,
  ev: HTMLElementEventMap[K]
) => void;

type DocumentEventListener<K extends keyof DocumentEventMap> = (
  this: Document,
  ev: DocumentEventMap[K]
) => void;

type WindowEventListener<K extends keyof WindowEventMap> = (
  this: Window,
  ev: WindowEventMap[K]
) => void;

type Options = boolean | AddEventListenerOptions;

type UseEventListener = {
  <K extends keyof HTMLElementEventMap, T extends HTMLElement = HTMLElement>(
    config: {
      target: React.RefObject<T> | T | null;
      eventType: K;
      handler: ElementEventListener<K>;
      options?: Options;
    },
    shouldAttach?: boolean
  ): void;
  <K extends keyof DocumentEventMap, T extends Document = Document>(
    config: {
      target: T | null;
      eventType: K;
      handler: DocumentEventListener<K>;
      options?: Options;
    },
    shouldAttach?: boolean
  ): void;
  <K extends keyof WindowEventMap, T extends Window = Window>(
    config: {
      target: T | null;
      eventType: K;
      handler: WindowEventListener<K>;
      options?: Options;
    },
    shouldAttach?: boolean
  ): void;
};

const isOptionParamSupported = (): boolean => {
  let optionSupported = false;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const fn = () => {};

  try {
    const opt = Object.defineProperty({}, "passive", {
      get: () => {
        optionSupported = true;
        return null;
      }
    });

    window.addEventListener("test", fn, opt);
    window.removeEventListener("test", fn, opt);
  } catch (e) {
    return false;
  }

  return optionSupported;
};

/**
 * Cherry-picked from https://github.com/mimshins/utilityjs/tree/main/src/hook/useEventListener
 */
const useEventListener: UseEventListener = (
  config: {
    target:
      | React.RefObject<HTMLElement>
      | HTMLElement
      | Window
      | Document
      | null;
    eventType: string;
    handler: unknown;
    options?: Options;
  },
  shouldAttach = true
): void => {
  const { target = null, eventType, handler, options } = config;

  const cachedOptions = useLatest(options);
  const cachedHandler = useLatest(handler);

  React.useEffect(() => {
    const element = target && "current" in target ? target.current : target;

    if (!element) return;

    let unsubscribed = false;
    const listener = (event: Event) => {
      if (unsubscribed) return;
      (cachedHandler.current as (ev: Event) => void)(event);
    };

    let thirdParam = cachedOptions.current;

    if (typeof cachedOptions.current !== "boolean") {
      if (isOptionParamSupported()) thirdParam = cachedOptions.current;
      else thirdParam = undefined;
    }

    shouldAttach && element.addEventListener(eventType, listener, thirdParam);

    return () => {
      unsubscribed = true;
      element.removeEventListener(eventType, listener, thirdParam);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, eventType, shouldAttach]);
};

export default useEventListener;
