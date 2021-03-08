import { useRef, useEffect } from "react";

export default function useConstantProp(
  initialValue,
  defaultValue,
  options = {}
) {
  const { componentName, propName, errorHandler } = options;

  const { current: value } = useRef(
    initialValue != null ? initialValue : defaultValue
  );

  useEffect(() => {
    if (initialValue != null && initialValue !== value) {
      if (errorHandler)
        throw new Error(`[Sonnat][${componentName}]: ${errorHandler()}`);
      else {
        throw new Error(
          `[Sonnat][${componentName}]: It seems that you are changing the \`${propName}\` prop after being initialized.` +
            `This property can't be changed after being initialized.`
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  return value;
}
