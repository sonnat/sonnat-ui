import * as React from "react";

const useIsMounted = (): (() => boolean) => {
  const isMountedRef = React.useRef(false);

  React.useEffect(() => {
    isMountedRef.current = true;
    return () => void (isMountedRef.current = false);
  }, []);

  return React.useCallback(() => isMountedRef.current, []);
};

export default useIsMounted;
