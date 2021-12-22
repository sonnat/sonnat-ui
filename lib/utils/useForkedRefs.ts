import * as React from "react";
import setRef from "./setRef";

/**
 * Cherry-picked from https://github.com/mimshins/utilityjs/tree/main/src/hook/useForkedRefs
 */
const useForkedRefs = <T>(...refs: React.Ref<T>[]): React.RefCallback<T> =>
  React.useCallback(
    (instance: T) => void refs.forEach(ref => void setRef(ref, instance)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [refs]
  );

export default useForkedRefs;
