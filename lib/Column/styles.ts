import type { CSSProperties } from "react";
import makeStyles from "../styles/makeStyles";

export const gridNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;
export type GridNumbers = typeof gridNumbers[number];

const useStyles = makeStyles(
  theme => {
    const {
      breakpoints,
      direction,
      spacings: { spaces },
      typography: { fontFamily }
    } = theme;

    const generatedClasses = breakpoints.keys.reduce((style, key) => {
      const _styles: typeof style = {};

      gridNumbers.forEach(size => {
        // Keep 7 significant numbers.
        const width = `${Math.round((size / 12) * 10e7) / 10e5}%`;

        const predefinedStyles: typeof style = {
          column: {
            flexBasis: width,
            maxWidth: width,
            flexGrow: 0,
            flexShrink: 0
          },
          offset: {
            ...(direction === "rtl"
              ? { marginRight: width }
              : { marginLeft: width })
          },
          order: { order: size }
        };

        _styles[`column${size}`] = predefinedStyles.column;
        _styles[`offset${size}`] = predefinedStyles.offset;
        _styles[`order${size}`] = predefinedStyles.order;

        _styles[`${key}Column${size}`] = {
          [breakpoints.up(key)]: predefinedStyles.column
        };
        _styles[`${key}Offset${size}`] = {
          [breakpoints.up(key)]: predefinedStyles.offset
        };
        _styles[`${key}Order${size}`] = {
          [breakpoints.up(key)]: predefinedStyles.order
        };
      });

      return { ...style, ..._styles };
    }, {} as Record<string, CSSProperties>);

    return {
      root: {
        position: "relative",
        direction,
        fontFamily: fontFamily[direction],
        width: "100%",
        paddingRight: spaces[3].rem,
        paddingLeft: spaces[3].rem,
        maxWidth: "100%",
        flexBasis: "0",
        flexGrow: "1"
      },
      ...generatedClasses
    };
  },
  { name: "SonnatColumn" }
);

export default useStyles;
