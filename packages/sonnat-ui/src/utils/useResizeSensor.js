import debounce from "lodash.debounce";
import throttle from "lodash.throttle";
import * as React from "react";

const setRefreshRate = (cb, refreshOptions = {}) => {
  const { mode, rate = 250, leading, trailing } = refreshOptions;

  switch (mode) {
    case "debounce": {
      const lodashOptions = {
        leading: leading != null ? leading : false,
        trailing: trailing != null ? trailing : true
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return debounce(cb, rate, lodashOptions);
    }
    case "throttle": {
      const lodashOptions = {
        leading: leading != null ? leading : true,
        trailing: trailing != null ? trailing : true
      };
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      return throttle(cb, rate, lodashOptions);
    }
    default:
      return cb;
  }
};

const useResizeSensor = (refreshOptions = {}) => {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  const handleOnResize = React.useCallback(entries => {
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

  const registerCleanupRef = React.useRef(null);

  const registerNode = React.useCallback(
    node => {
      if (registerCleanupRef.current !== null) {
        registerCleanupRef.current();
        registerCleanupRef.current = null;
      }

      if (node != null) {
        const observer = new ResizeObserver(resizeCallback);
        observer.observe(node);

        registerCleanupRef.current = () => {
          observer.disconnect();
          if (resizeCallback.cancel) resizeCallback.cancel();
        };
      }
    },
    [resizeCallback]
  );

  return { width: size.width, height: size.height, registerNode };
};

export default useResizeSensor;
