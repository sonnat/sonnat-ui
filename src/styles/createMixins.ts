import * as React from "react";
import type { Typography } from "./createTypography";

export interface Mixins extends Record<string, unknown> {
  disableUserSelect: () => React.CSSProperties;
  asIconWrapper: (size: number) => React.CSSProperties;
}

export interface Options {
  pxToRem: Typography["pxToRem"];
}

const createMixins = <T extends Partial<Mixins>>(
  mixinsInput?: T,
  options?: Options
): T & Mixins => {
  const { pxToRem } = options || {};

  const _disableUserSelect: Mixins["disableUserSelect"] = () => ({
    WebkitUserSelect: "none",
    MozUserSelect: "none",
    MsUserSelect: "none",
    KhtmlUserSelect: "none",
    userSelect: "none",
    WebkitTouchCallout: "none",
    MsTouchAction: "pan-y",
    touchAction: "pan-y",
    WebkitTapHighlightColor: "transparent"
  });

  const _asIconWrapper = (size: number) => {
    const sizing =
      typeof size !== "undefined"
        ? {
            width: pxToRem ? pxToRem(size) : size,
            height: pxToRem ? pxToRem(size) : size,
            minWidth: pxToRem ? pxToRem(size) : size,
            minHeight: pxToRem ? pxToRem(size) : size,
            fontSize: pxToRem ? pxToRem(size) : size
          }
        : {};

    return {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...sizing
    };
  };

  const {
    disableUserSelect = _disableUserSelect,
    asIconWrapper = _asIconWrapper,
    ...other
  } = mixinsInput || {};

  return {
    disableUserSelect,
    asIconWrapper,
    ...other
  } as T & Mixins;
};

export default createMixins;
