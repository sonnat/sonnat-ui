import * as React from "react";

export default function useIsMounted() {
  const isMounted = React.useRef(false);

  React.useEffect(() => {
    isMounted.current = true;
    return () => void (isMounted.current = false);
  }, []);

  return isMounted.current;
}
