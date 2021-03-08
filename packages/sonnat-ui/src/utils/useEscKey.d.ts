/**
 *
 * @function useEscKey
 *
 * @param {EventListenerOrEventListenerObject} keyListenerFn
 * The object that receives a notification (an object that implements the `Event` interface)
 * when an event of the specified type occurs.
 * This must be an object implementing the `EventListener` interface, or a JavaScript function.
 * See [The event listener callback](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#The_event_listener_callback)
 * for details on the callback itself.
 *
 * @returns {{bind: () => void, unbind: () => void}}
 *
 */
export default function useEscKey(
  // eslint-disable-next-line
  keyListenerFn: EventListenerOrEventListenerObject
): { bind: () => void; unbind: () => void };
