import { ChangeEvent } from "react";
import { CheckGroupProps } from "./CheckGroup";

export interface CheckGroupState
  extends Pick<CheckGroupProps, "name" | "value"> {
  /**
   * The Callback fires when a checkbox has selected.
   *
   * @param {ChangeEvent<HTMLInputElement>} event The event source of the callback.
   */
  // eslint-disable-next-line no-unused-vars
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function useCheckGroup(): CheckGroupState | undefined;
