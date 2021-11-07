import * as React from "react";
import type { NotUndefined } from "../typings";
import isUndef from "./isUndef";

interface Options {
  componentName: string;
  propName: string;
  errorHandler?: () => string;
}

const useConstantProp = <T>(
  initialValue: T | undefined,
  defaultValue: NotUndefined<T>,
  options: Options
): T => {
  const { componentName, propName, errorHandler } = options;

  const { current: value } = React.useRef(
    !isUndef(initialValue) ? initialValue : defaultValue
  );

  React.useEffect(() => {
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
};

export default useConstantProp;
