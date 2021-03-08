import { useContext } from "react";
import TextFieldContext from "./context";

export default function useTextField() {
  return useContext(TextFieldContext);
}
