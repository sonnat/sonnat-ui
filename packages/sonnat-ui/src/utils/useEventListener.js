import { useRef, useEffect } from "react";

const isOptionParamSupported = () => {
  let optionSupported = false;
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

export default function useEventListener(
  eventListener,
  shouldBeAttached = true
) {
  const {
    element = null,
    eventName = "",
    listener = () => {},
    options = { useCapture: false }
  } = eventListener;

  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = listener;
  }, [listener]);

  useEffect(() => {
    const eventListener = evt => savedHandler.current(evt);
    const { useCapture, ...restOpts } = options;
    const thirdParam = isOptionParamSupported()
      ? { capture: useCapture || false, ...restOpts }
      : useCapture || false;

    if (element && shouldBeAttached)
      element.addEventListener(eventName, eventListener, thirdParam);

    return () => {
      if (element)
        element.removeEventListener(eventName, eventListener, thirdParam);
    };
  }, [element, eventName, shouldBeAttached, options]);
}
