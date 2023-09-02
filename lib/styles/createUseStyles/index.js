import * as React from "react";
import isInBrowser from "is-in-browser";

import { JssContext } from "react-jss";
import {
  createStyleSheet,
  addDynamicRules,
  updateDynamicRules,
  removeDynamicRules
} from "react-jss/src/utils/sheets";
import getSheetIndex from "react-jss/src/utils/getSheetIndex";
import { manageSheet, unmanageSheet } from "react-jss/src/utils/managers";
import getSheetClasses from "react-jss/src/utils/getSheetClasses";

const useEffectOrLayoutEffect = isInBrowser
  ? React.useLayoutEffect
  : React.useEffect;

const noTheme = {};

const createUseStyles = (styles, options = {}) => {
  const { index = getSheetIndex(), theming, name, ...sheetOptions } = options;
  const ThemeContext = (theming && theming.context);

  const useTheme = theme => {
    if (typeof styles === "function") {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return theme || React.useContext(ThemeContext) || noTheme;
    }

    return noTheme;
  };

  const emptyObject = {};

  return function useStyles(data) {
    const isFirstMount = React.useRef(true);
    const context = React.useContext(JssContext);
    const theme = useTheme(data && data.theme);

    const [sheet, dynamicRules] = React.useMemo(() => {
      const newSheet = createStyleSheet({
        context,
        styles,
        name,
        theme,
        index,
        sheetOptions
      });

      const newDynamicRules = newSheet ? addDynamicRules(newSheet, data) : null;

      if (newSheet) {
        manageSheet({
          index,
          context,
          sheet: newSheet,
          theme
        });
      }

      return [newSheet, newDynamicRules];
    }, [context, theme]);

    useEffectOrLayoutEffect(() => {
      // We only need to update the rules on a subsequent update and not in the first mount
      if (sheet && dynamicRules && !isFirstMount.current) {
        updateDynamicRules(data, sheet, dynamicRules);
      }
    }, [data]);

    useEffectOrLayoutEffect(
      () =>
        // cleanup only
        () => {
          if (sheet) {
            unmanageSheet({
              index,
              context,
              sheet,
              theme
            });
          }

          if (sheet && dynamicRules) {
            removeDynamicRules(sheet, dynamicRules);
          }
        },
      [sheet]
    );

    const classes = React.useMemo(
      () =>
        sheet && dynamicRules
          ? getSheetClasses(sheet, dynamicRules)
          : emptyObject,
      [sheet, dynamicRules]
    );

    React.useDebugValue(classes);

    React.useDebugValue(theme === noTheme ? "No theme" : theme);

    React.useEffect(() => {
      isFirstMount.current = false;
    });

    return classes;
  };
};

export default createUseStyles;
