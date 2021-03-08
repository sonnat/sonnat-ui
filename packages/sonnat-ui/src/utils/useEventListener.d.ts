/**
 * @function useEventListener
 *
 * @param {object} eventListener
 * @param {HTMLElement} eventListener.element The target element to which the listener will be attached.
 * @param {string} eventListener.eventName A case-sensitive string representing the event type to listen for.
 * @param {EventListenerOrEventListenerObject} eventListener.listener
 * See [The event listener callback](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#The_event_listener_callback)
 * for details on the callback itself.
 *
 * @param {boolean | AddEventListenerOptions | {useCapture: false}} eventListener.options?
 * See [The event listener callback](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)
 * for details on the callback itself.
 *
 * @param {boolean} shouldBeAttached? If set to `true`, the listener will be attached. (default = true)
 *
 */
export default function useEventListener(
  /* eslint-disable */
  eventListener: {
    element: HTMLElement;
    eventName: string;
    listener: EventListenerOrEventListenerObject;
    options?:
      | boolean
      | AddEventListenerOptions
      | { useCapture: boolean = false };
  },
  shouldBeAttached?: boolean = true
  /* eslint-enable */
): void;
