import * as React from "react";
import type { NotUndefined } from "../typings";
import isUndef from "./isUndef";

interface Options {
  componentName: string;
  propName: string;
  errorHandler?: () => string;
}

type R<T1, T2> = T2 extends undefined ? T1 | undefined : NotUndefined<T1 | T2>;

const useConstantProp = <T1, T2>(
  initialValue: T1,
  defaultValue: T2,
  options: Options
): R<T1, T2> => {
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

  return value as R<T1, T2>;
};

export default useConstantProp;
