import * as React from "react";

const useSyncEffect = (
  effectCallback: React.EffectCallback,
  dependencyList?: React.DependencyList
): void => {
  const key = React.useRef({});
  const cleanupRef = React.useRef<ReturnType<typeof effectCallback>>();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const currentKey = React.useMemo(() => ({}), dependencyList);

  if (key !== currentKey) {
    key.current = currentKey;
    cleanupRef.current = effectCallback();
  }

  React.useEffect(
    () => () => {
      if (cleanupRef.current) cleanupRef.current();
    },
    [currentKey]
  );
};

export default useSyncEffect;
