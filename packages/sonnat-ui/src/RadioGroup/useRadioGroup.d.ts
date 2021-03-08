import { ChangeEvent } from "react";
import { RadioGroupProps } from "./RadioGroup";

export interface RadioGroupState
  extends Pick<RadioGroupProps, "name" | "value"> {
  /**
   * The Callback fires when a radio button has selected.
   *
   * @param {ChangeEvent<HTMLInputElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function useRadioGroup(): RadioGroupState | undefined;
