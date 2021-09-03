import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "../styles/makeStyles";
import getVar from "../utils/getVar";

const componentName = "Flex";

const allowedVariants = ["inline", "block"];
const allowedWraps = ["nowrap", "wrap", "wrap-reverse"];
const allowedDirections = ["row", "column", "row-reverse", "column-reverse"];
const allowedContentAlignments = [
  "start",
  "end",
  "center",
  "between",
  "around",
  "evenly",
  "stretch"
];
const allowedMainAxisAlignments = [
  "start",
  "end",
  "center",
  "between",
  "around",
  "evenly"
];
const allowedCrossAxisAlignments = [
  "start",
  "end",
  "center",
  "baseline",
  "stretch"
];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const baseStyles = {
  block: { display: "flex" },
  inline: { display: "inline-flex" },
  row: { flexDirection: "row" },
  column: { flexDirection: "column" },
  rowReverse: { flexDirection: "row-reverse" },
  columnReverse: { flexDirection: "column-reverse" },
  justifyStart: { justifyContent: "flex-start" },
  justifyEnd: { justifyContent: "flex-end" },
  justifyCenter: { justifyContent: "center" },
  justifyBetween: { justifyContent: "space-between" },
  justifyAround: { justifyContent: "space-around" },
  justifyEvenly: { justifyContent: "space-evenly" },
  contentStart: { alignContent: "flex-start" },
  contentEnd: { alignContent: "flex-end" },
  contentCenter: { alignContent: "center" },
  contentBetween: { alignContent: "space-between" },
  contentAround: { alignContent: "space-around" },
  contentEvenly: { alignContent: "space-evenly" },
  contentStretch: { alignContent: "stretch" },
  alignStart: { alignItems: "flex-start" },
  alignEnd: { alignItems: "flex-end" },
  alignCenter: { alignItems: "center" },
  alignBaseline: { alignItems: "baseline" },
  alignStretch: { alignItems: "stretch" },
  nowrap: { flexWrap: "nowrap" },
  wrap: { flexWrap: "wrap" },
  wrapReverse: { flexWrap: "wrap-reverse" }
};

const createClassStyle = (validValues, key, prefix = "") => {
  const classNames = {};

  const classStyles = validValues.reduce((style, value) => {
    const hash = camelCase(`${key}-${prefix ? prefix + "-" : ""}${value}`);
    const baseKey = camelCase(`${prefix ? prefix + "-" : ""}${value}`);

    classNames[hash] = {};

    return {
      ...style,
      [hash]: baseStyles[baseKey]
    };
  }, {});

  return { classStyles, classNames };
};

const generateResponsiveStyles = breakpoints => {
  const styles = breakpoints.keys.reduce((result, key) => {
    const media = [breakpoints.up(key)];

    const variants = createClassStyle(allowedVariants, key);
    const wraps = createClassStyle(allowedWraps, key);
    const dirs = createClassStyle(allowedDirections, key);
    const content = createClassStyle(allowedContentAlignments, key, "content");
    const justify = createClassStyle(allowedMainAxisAlignments, key, "justify");
    const align = createClassStyle(allowedCrossAxisAlignments, key, "align");

    const style = {
      ...variants.classStyles,
      ...wraps.classStyles,
      ...dirs.classStyles,
      ...content.classStyles,
      ...justify.classStyles,
      ...align.classStyles
    };

    const classes = {
      ...variants.classNames,
      ...wraps.classNames,
      ...dirs.classNames,
      ...content.classNames,
      ...justify.classNames,
      ...align.classNames
    };

    return {
      ...result,
      ...classes,
      [media]: { ...result[media], ...style }
    };
  }, {});

  return styles;
};

const useStyles = makeStyles(
  theme => ({
    root: {},
    ...baseStyles,
    ...generateResponsiveStyles(theme.breakpoints)
  }),
  { name: `Sonnat${componentName}` }
);

const getValueOfProp = (prop, defaultValue, validValues) => {
  const isShape = typeof prop === "object";

  if (!isShape) return getVar(prop, defaultValue, !validValues.includes(prop));

  return [
    ...Object.keys(prop).map(key => ({ [key]: prop[key] })),
    { default: defaultValue }
  ];
};

const createResponsiveClass = (prop, classes, prefix = "") => {
  if (typeof prop === "object" && Array.isArray(prop)) {
    return prop.map(breakValue => {
      const key = Object.keys(breakValue)[0];
      const value = breakValue[key];

      return key === "default"
        ? classes[camelCase(`${prefix ? prefix + "-" : ""}${value}`)]
        : classes[camelCase(`${key}-${prefix ? prefix + "-" : ""}${value}`)];
    });
  }

  return classes[camelCase(`${prefix ? prefix + "-" : ""}${prop}`)];
};

const Flex = React.memo(
  React.forwardRef(function Flex(props, ref) {
    const {
      className,
      children,
      rootNode: RootNode = "div",
      variant: variantProp = "block",
      wrap: wrapProp = "nowrap",
      direction: directionProp = "row",
      mainAxisAlignment: mainAxisAlignmentProp = "start",
      crossAxisAlignment: crossAxisAlignmentProp = "stretch",
      contentAlignment: contentAlignmentProp = "start",
      ...otherProps
    } = props;

    const classes = useStyles();

    const variant = getValueOfProp(variantProp, "block", allowedVariants);
    const wrap = getValueOfProp(wrapProp, "nowrap", allowedWraps);
    const direction = getValueOfProp(directionProp, "row", allowedDirections);

    const contentAlignment = getValueOfProp(
      contentAlignmentProp,
      "start",
      allowedContentAlignments
    );

    const mainAxisAlignment = getValueOfProp(
      mainAxisAlignmentProp,
      "start",
      allowedMainAxisAlignments
    );

    const crossAxisAlignment = getValueOfProp(
      crossAxisAlignmentProp,
      "stretch",
      allowedCrossAxisAlignments
    );

    return (
      <RootNode
        ref={ref}
        className={clx(
          className,
          classes.root,
          createResponsiveClass(variant, classes),
          createResponsiveClass(wrap, classes),
          createResponsiveClass(direction, classes),
          createResponsiveClass(contentAlignment, classes, "content"),
          createResponsiveClass(mainAxisAlignment, classes, "justify"),
          createResponsiveClass(crossAxisAlignment, classes, "align")
        )}
        {...otherProps}
      >
        {children}
      </RootNode>
    );
  })
);

const getResponsivePropTypeOf = validValues => {
  return PropTypes.oneOfType([
    PropTypes.oneOf(validValues),
    PropTypes.shape({
      xxs: PropTypes.oneOf(validValues),
      xs: PropTypes.oneOf(validValues),
      sm: PropTypes.oneOf(validValues),
      md: PropTypes.oneOf(validValues),
      lg: PropTypes.oneOf(validValues),
      xlg: PropTypes.oneOf(validValues)
    })
  ]);
};

Flex.displayName = componentName;

Flex.propTypes = {
  children: PropTypes.node,
  rootNode: PropTypes.elementType,
  className: PropTypes.string,
  variant: PropTypes.oneOf(allowedVariants),
  wrap: getResponsivePropTypeOf(allowedWraps),
  direction: getResponsivePropTypeOf(allowedDirections),
  mainAxisAlignment: getResponsivePropTypeOf(allowedMainAxisAlignments),
  crossAxisAlignment: getResponsivePropTypeOf(allowedCrossAxisAlignments),
  contentAlignment: getResponsivePropTypeOf(allowedContentAlignments)
};

export default Flex;
