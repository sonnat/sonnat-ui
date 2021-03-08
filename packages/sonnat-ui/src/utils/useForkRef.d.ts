import { Ref } from "react";

/**
 * @function useForkRef
 *
 * @param {Ref<any>} refA The reference object/function.
 * @param {Ref<any>} refB The reference object/function.
 */
/* eslint-disable */
export default function useForkRef(
  refA: Ref<any>,
  refB: Ref<any>
): (value: any) => void;
/* eslint-enable */
