import { useContext } from "react";
import InputBaseContext from "./context";

export default function useInputBase() {
  return useContext(InputBaseContext);
}
