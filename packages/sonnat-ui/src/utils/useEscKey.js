import { useCallback, useState } from "react";

const isServer = typeof window === "undefined";

export default function useEscKey(keyListenerFn) {
  const [isBound, setBound] = useState(false);

  const keyListener = useCallback(
    evt => {
      const e = evt || window.event;

      switch (e.key) {
        case "Esc":
        case "Escape":
        case "esc":
        case "escape":
          keyListenerFn(evt);
          break;
        default:
          break;
      }
    },
    [keyListenerFn]
  );

  const bind = useCallback(() => {
    if (!isServer) {
      if (!isBound) {
        document.addEventListener("keyup", keyListener);
        setBound(true);
      }
    }
  }, [keyListener, isBound]);

  const unbind = useCallback(() => {
    if (!isServer) {
      if (isBound) {
        document.removeEventListener("keyup", keyListener);
        setBound(false);
      }
    }
  }, [keyListener, isBound]);

  return { bind, unbind };
}
