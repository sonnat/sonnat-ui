import * as React from "react";
import useGetLatest from "./useGetLatest";

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

  const getHandler = useGetLatest(handler);
  const getOptions = useGetLatest(options);

  React.useEffect(() => {
    const _handler_ = getHandler();
    const _options_ = getOptions();

    const element = target && "current" in target ? target.current : target;

    const listener = (event: Event) =>
      (_handler_ as (ev: Event) => void)(event);

    let thirdParam = _options_;

    if (typeof _options_ !== "boolean") {
      if (isOptionParamSupported()) thirdParam = _options_;
      else thirdParam = undefined;
    }

    if (element != null && shouldAttach) {
      element.addEventListener(eventType, listener, thirdParam);
    }

    return () => {
      if (element != null) {
        element.removeEventListener(eventType, listener, thirdParam);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, eventType, shouldAttach]);
};

export default useEventListener;
