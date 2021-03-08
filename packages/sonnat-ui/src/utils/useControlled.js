import { useRef, useState, useCallback, useEffect } from "react";

const isEqual = (v1, v2) => {
  if (typeof v1 !== typeof v2) return false;
  if (typeof v1 === "object" && !Array.isArray(v1)) return false;
  else if (
    typeof v1 === "object" &&
    Array.isArray(v1) &&
    v1.length !== v2.length
  ) {
    return false;
  } else {
    for (let i = 0; i < v1.length; i++) {
      if (v1[i] !== v2[i]) return false;
    }
  }

  return true;
};

export default function useControlled(
  controlledValue,
  defaultValue,
  componentName
) {
  const { current: isControlled } = useRef(controlledValue != null);
  const { current: _defaultValue } = useRef(defaultValue);

  const [uncontrolledValue, setUncontrolledValue] = useState(_defaultValue);

  const value = isControlled ? controlledValue : uncontrolledValue;

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (
        !isControlled &&
        _defaultValue !== defaultValue &&
        !isEqual(_defaultValue, defaultValue)
      ) {
        // eslint-disable-next-line no-console
        console.error(
          `Sonnat: A component is changing the defaultValue state of an uncontrolled ${componentName} after being initialized.` +
            ` To suppress this warning opt to use a controlled ${componentName}.`
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValue]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (isControlled !== (controlledValue !== undefined)) {
        // eslint-disable-next-line no-console
        console.error(
          [
            `Sonnat: A component is changing the ${
              isControlled ? "" : "un"
            }controlled state of ${componentName} to be ${
              isControlled ? "un" : ""
            }controlled.`,
            "Elements should not switch from uncontrolled to controlled (or vice versa).",
            `Decide between using a controlled or uncontrolled ${componentName} ` +
              "element for the lifetime of the component.",
            "The nature of the state is determined during the first render, it's considered controlled if the state is not `undefined`.",
            "More info: https://fb.me/react-controlled-components"
          ].join("\n")
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [componentName, controlledValue]);
  }

  return [
    value,
    useCallback(newValue => {
      if (!isControlled) setUncontrolledValue(newValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
    isControlled
  ];
}
