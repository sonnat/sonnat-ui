import { createUseStyles } from "react-jss";

export default function makeStyles(styles, options = {}) {
  const {
    name,
    classNamePrefix: classNamePrefixOption,
    meta: metaOption,
    ...sheetOptions
  } = options;

  const classNamePrefix = name || classNamePrefixOption || "Sonnat";
  const meta = metaOption || classNamePrefix;

  return createUseStyles(styles, {
    classNamePrefix,
    name,
    meta,
    ...sheetOptions
  });
}
