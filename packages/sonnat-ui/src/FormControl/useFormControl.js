import { useContext } from "react";
import FormControlContext from "./context";

export default function useFormControl() {
  return useContext(FormControlContext);
}
