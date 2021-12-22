import * as React from "react";

const isEqual = <T>(v1: T, v2: T): boolean => {
  if (typeof v1 !== typeof v2) return false;
  if (typeof v1 === "object") {
    if (!Array.isArray(v1)) return false;
    else if (v1.length !== (<typeof v1>v2).length) return false;
    else {
      for (let i = 0; i < v1.length; i++) {
        if (v1[i] !== (<typeof v1>v2)[i]) return false;
      }
    }
  }

  return true;
};

const isUndef = <T>(value: T): boolean => typeof value === "undefined";

/**
 * Cherry-picked from https://github.com/mimshins/utilityjs/tree/main/src/hook/useControlledProp
 */
const useControlledProp = <T>(
  controlledValueProp: T | undefined,
  defaultValueProp: T | undefined,
  fallbackValue: T
): [
  value: T,
  setUncontrolledValue: (value: React.SetStateAction<T>) => void,
  isControlled: boolean
] => {
  const { current: isControlled } = React.useRef(!isUndef(controlledValueProp));
  const { current: defaultValue } = React.useRef(defaultValueProp);

  const { current: fallback } = React.useRef<T | undefined>(
    isUndef(controlledValueProp)
      ? isUndef(defaultValueProp)
        ? fallbackValue
        : defaultValueProp
      : undefined
  );

  if (process.env.NODE_ENV !== "production") {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (
        !isControlled &&
        defaultValue !== defaultValueProp &&
        !isEqual(defaultValue, defaultValueProp)
      ) {
        // eslint-disable-next-line no-console
        console.error(
          [
            `Sonnat: A component is changing the defaultValue state of an uncontrolled prop after being initialized.`,
            `To suppress this warning use a controlled prop.`
          ].join(" ")
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [defaultValueProp]);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (isControlled !== !isUndef(controlledValueProp)) {
        // eslint-disable-next-line no-console
        console.error(
          [
            `Sonnat: A component is changing the ${
              isControlled ? "" : "un"
            }controlled state of a prop to be ${
              isControlled ? "un" : ""
            }controlled.`,
            "Decide between using a controlled or uncontrolled prop " +
              "for the lifetime of the component.",
            "The nature of the prop's state is determined during the first render, it's considered controlled if the prop is not `undefined`."
          ].join("\n")
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [controlledValueProp]);

    if (
      isUndef(controlledValueProp) &&
      isUndef(defaultValueProp) &&
      isUndef(fallbackValue)
    ) {
      // eslint-disable-next-line no-console
      console.error(
        [
          "Sonnat: The values you provide are `undefined`!",
          "To suppress this warning use a valid non-undefined controlled, default or fallback value."
        ].join(" ")
      );
    }
  }

  const [uncontrolledValue, setUncontrolledValue] = React.useState(fallback);
  const value = isControlled ? <T>controlledValueProp : <T>uncontrolledValue;

  return [
    value,
    React.useCallback((newValue: React.SetStateAction<T>) => {
      if (!isControlled) setUncontrolledValue(<T>newValue);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
    isControlled
  ];
};

export default useControlledProp;
