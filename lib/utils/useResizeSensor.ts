import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import * as React from "react";

interface RefreshOptions {
  mode: "debounce" | "throttle";
  rate?: number;
  leading?: boolean;
  trailing?: boolean;
}

interface Return {
  width: number;
  height: number;
  registerNode: <T extends HTMLElement>(node: T | null) => void;
}

interface Debounced<T extends (...args: never[]) => unknown> {
  (...args: Parameters<T>): ReturnType<T> | undefined;
  cancel(): void;
  flush(): ReturnType<T> | undefined;
}

const setRefreshRate = (
  cb: ResizeObserverCallback,
  refreshOptions?: RefreshOptions
): Debounced<ResizeObserverCallback> | ResizeObserverCallback => {
  const { mode, rate = 250, leading, trailing } = refreshOptions || {};

  switch (mode) {
    case "debounce": {
      const lodashOptions = {
        leading: leading != null ? leading : false,
        trailing: trailing != null ? trailing : true
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return debounce(
        cb,
        rate,
        lodashOptions
      ) as Debounced<ResizeObserverCallback>;
    }
    case "throttle": {
      const lodashOptions = {
        leading: leading != null ? leading : true,
        trailing: trailing != null ? trailing : true
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return throttle(
        cb,
        rate,
        lodashOptions
      ) as Debounced<ResizeObserverCallback>;
    }
    default:
      return cb;
  }
};

const useResizeSensor = (refreshOptions?: RefreshOptions): Return => {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const handleOnResize: ResizeObserverCallback = React.useCallback(entries => {
    entries.forEach(entry => {
      const { width, height } = entry.contentRect;

      setSize(prevSize => {
        if (prevSize.width === width && prevSize.height === height)
          return prevSize;

        return { width, height };
      });
    });
  }, []);

  const resizeCallback = React.useMemo(
    () => setRefreshRate(handleOnResize, refreshOptions),
    [handleOnResize, refreshOptions]
  );

  const registerCleanupRef = React.useRef<(() => void) | null>(null);

  const registerNode = React.useCallback(
    <T extends HTMLElement>(node: T | null) => {
      if (registerCleanupRef.current !== null) {
        registerCleanupRef.current();
        registerCleanupRef.current = null;
      }

      if (node != null) {
        const observer = new ResizeObserver(resizeCallback);
        observer.observe(node);

        registerCleanupRef.current = () => {
          observer.disconnect();
          if ((resizeCallback as Debounced<ResizeObserverCallback>).cancel)
            (resizeCallback as Debounced<ResizeObserverCallback>).cancel();
        };
      }
    },
    [resizeCallback]
  );

  return { width: size.width, height: size.height, registerNode };
};

export default useResizeSensor;
