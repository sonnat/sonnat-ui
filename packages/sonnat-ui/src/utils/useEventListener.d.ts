/**
 * A custom React Hook that handles binding and unbinding event listeners in a smart way.
 */
export default function useEventListener(
  /* eslint-disable */
  eventListener: {
    /**
     * The target element to which the listener will be attached.
     */
    element: HTMLElement | null;
    /**
     * A case-sensitive string representing the event type to listen for.
     */
    eventName: string;
    /**
     * See [The event listener callback](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#The_event_listener_callback)
     * for details on the callback itself.
     */
    listener: EventListenerOrEventListenerObject;
    /**
     * See [The event listener callback](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Parameters)
     * for details on the callback itself.
     */
    options?:
      | boolean
      | AddEventListenerOptions
      | { useCapture: boolean = false };
  },
  /**
   * If set to `true`, the listener will be attached. (default = true)
   */
  shouldBeAttached?: boolean = true
  /* eslint-enable */
): void;
