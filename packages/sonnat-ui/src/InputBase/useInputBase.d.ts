import { InputBaseProps } from "./InputBase";

export interface InputBaseState
  extends Pick<InputBaseProps, "size" | "disabled" | "hasError"> {}

export default function useInputBase(): InputBaseState | undefined;
