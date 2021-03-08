import { FocusEvent } from "react";
import { FormControlProps } from "./FormControl";

export interface FormControlState
  extends Pick<
    FormControlProps,
    "fluid" | "size" | "disabled" | "hasError" | "required"
  > {
  /** Determines the state of the form controller's focus. */
  focusedState?: boolean;
  /**
   * The Callback fires when the form controller has received focus.
   *
   * @param {FocusEvent<HTMLInputElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  /**
   * The Callback fires when the form controller has lost focus.
   *
   * @param {FocusEvent<HTMLInputElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
}

export default function useFormControl(): FormControlState | undefined;
