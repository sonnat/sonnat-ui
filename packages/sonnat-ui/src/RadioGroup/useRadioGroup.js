import { useContext } from "react";
import RadioGroupContext from "./context";

export default function useRadioGroup() {
  return useContext(RadioGroupContext);
}
