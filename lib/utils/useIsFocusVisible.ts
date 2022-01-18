import * as React from "react";

let hadKeyboardEvent = true;
let hadFocusVisibleRecently = false;
let hadFocusVisibleRecentlyTimeout:
  | ReturnType<Window["setTimeout"]>
  | undefined = undefined;

const inputTypesWhitelist = {
  text: true,
  search: true,
  url: true,
  tel: true,
  email: true,
  password: true,
  number: true,
  date: true,
  month: true,
  week: true,
  time: true,
  datetime: true,
  "datetime-local": true
};

/**
 * Computes whether the given element should automatically trigger the
 * `focus-visible` class being added, i.e. whether it should always match
 * `:focus-visible` when focused.
 */
const focusTriggersKeyboardModality = <T extends HTMLElement = HTMLElement>(
  node: T
) => {
  if (!node) return false;

  const { tagName } = node;

  if (
    tagName === "INPUT" &&
    inputTypesWhitelist[
      (<HTMLInputElement>(<unknown>node))
        .type as keyof typeof inputTypesWhitelist
    ] &&
    !(<HTMLInputElement>(<unknown>node)).readOnly
  )
    return true;

  if (tagName === "TEXTAREA" && !(<HTMLInputElement>(<unknown>node)).readOnly)
    return true;

  if (node.isContentEditable) return true;

  return false;
};

/**
 * Keep track of our keyboard modality state with `hadKeyboardEvent`.
 * If the most recent user interaction was via the keyboard;
 * and the key press did not include a meta, alt/option, or control key;
 * then the modality is keyboard. Otherwise, the modality is not keyboard.
 */
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.metaKey || event.altKey || event.ctrlKey) return;
  hadKeyboardEvent = true;
};

/**
 * If at any point a user clicks with a pointing device, ensure that we change
 * the modality away from keyboard.
 *
 * This avoids the situation where a user presses a key on an already focused
 * element, and then clicks on a different element, focusing it with a
 * pointing device, while we still think we're in keyboard modality.
 */
const handlePointerDown = () => {
  hadKeyboardEvent = false;
};

const handleVisibilityChange = () => {
  if (document.visibilityState === "hidden") {
    /*
     * If the tab becomes active again, the browser will handle calling focus
     * on the element (Safari actually calls it twice).
     *
     * If this tab change caused a blur on an element with focus-visible,
     * re-apply the class when the user switches back to the tab.
     */
    if (hadFocusVisibleRecently) hadKeyboardEvent = true;
  }
};

const prepare = (_doc_: Document): void => {
  _doc_.addEventListener("keydown", handleKeyDown, true);
  _doc_.addEventListener("mousedown", handlePointerDown, true);
  _doc_.addEventListener("pointerdown", handlePointerDown, true);
  _doc_.addEventListener("touchstart", handlePointerDown, true);
  _doc_.addEventListener("visibilitychange", handleVisibilityChange, true);
};

export const teardown = (_doc_: Document): void => {
  _doc_.removeEventListener("keydown", handleKeyDown, true);
  _doc_.removeEventListener("mousedown", handlePointerDown, true);
  _doc_.removeEventListener("pointerdown", handlePointerDown, true);
  _doc_.removeEventListener("touchstart", handlePointerDown, true);
  _doc_.removeEventListener("visibilitychange", handleVisibilityChange, true);
};

const isFocusVisible = <T extends HTMLElement = HTMLElement>(
  event: React.FocusEvent<T>
) => {
  if (!event.target) return false;

  try {
    return (<HTMLElement>event.target).matches(":focus-visible");
  } catch (error) {
    /**
     * Browsers not implementing `:focus-visible` will throw a SyntaxError.
     * We use our own heuristic for those browsers.
     *
     * Rethrow might be better if it's not the expected error but do we really
     * want to crash if focus-visible malfunctioned?
     */
  }

  /**
   * No need for validFocusTarget check. The user does that by attaching it to
   * focusable events only.
   */
  return (
    hadKeyboardEvent ||
    focusTriggersKeyboardModality(event.target as HTMLElement)
  );
};

interface Return<T extends HTMLElement = HTMLElement> {
  isFocusVisibleRef: React.MutableRefObject<boolean>;
  onFocus: (event: React.FocusEvent<T>) => boolean;
  onBlur: (event: React.FocusEvent<T>) => boolean;
  ref: (node: T | null) => void;
}

/**
 * Cherry-picked from https://github.com/mui-org/material-ui/blob/master/packages/mui-utils/src/useIsFocusVisible.js
 */
const useIsFocusVisible = <
  T extends HTMLElement = HTMLElement
>(): Return<T> => {
  const ref = React.useCallback((node: T | null) => {
    if (node) prepare(node.ownerDocument);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFocusVisibleRef = React.useRef(false);

  /**
   * Should be called if a blur event is fired
   */
  const handleBlurVisible = () => {
    /**
     * checking against potential state variable does not suffice if we focus and blur synchronously.
     * React wouldn't have time to trigger a re-render so `focusVisible` would be stale.
     *
     * TODO: check again if React releases their internal changes to focus event handling (https://github.com/facebook/react/pull/19186).
     */
    if (isFocusVisibleRef.current) {
      /**
       * To detect a tab/window switch, we look for a blur event followed
       * rapidly by a visibility change.
       *
       * If we don't see a visibility change within 100ms, it's probably a
       * regular focus change.
       */
      window.clearTimeout(hadFocusVisibleRecentlyTimeout);

      hadFocusVisibleRecently = true;

      hadFocusVisibleRecentlyTimeout = window.setTimeout(() => {
        hadFocusVisibleRecently = false;
      }, 100);

      isFocusVisibleRef.current = false;

      return true;
    }

    return false;
  };

  /**
   * Should be called if a focus event is fired
   */
  const handleFocusVisible = (event: React.FocusEvent<T>) => {
    if (isFocusVisible(event)) {
      isFocusVisibleRef.current = true;
      return true;
    }

    return false;
  };

  return {
    isFocusVisibleRef,
    onFocus: handleFocusVisible,
    onBlur: handleBlurVisible,
    ref
  };
};

export default useIsFocusVisible;
