import { useContext } from "react";
import CheckGroupContext from "./context";

export default function useCheckGroup() {
  return useContext(CheckGroupContext);
}
