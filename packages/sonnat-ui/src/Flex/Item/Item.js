import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import makeStyles from "../../styles/makeStyles";
import getVar from "../../utils/getVar";

const componentName = "FlexItem";

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
  justifyStart: { justifySelf: "flex-start" },
  justifyEnd: { justifySelf: "flex-end" },
  justifyCenter: { justifySelf: "center" },
  justifyBetween: { justifySelf: "space-between" },
  justifyAround: { justifySelf: "space-around" },
  justifyEvenly: { justifySelf: "space-evenly" },
  alignStart: { alignSelf: "flex-start" },
  alignEnd: { alignSelf: "flex-end" },
  alignCenter: { alignSelf: "center" },
  alignBaseline: { alignSelf: "baseline" },
  alignStretch: { alignSelf: "stretch" }
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

const generateResponsiveStyles = (breakpoints, direction) => {
  const styles = breakpoints.keys.reduce((result, key) => {
    const media = [breakpoints.up(key)];

    const justify = createClassStyle(allowedMainAxisAlignments, key, "justify");
    const align = createClassStyle(allowedCrossAxisAlignments, key, "align");

    const autoMarginStartValue = {
      ltr: { marginLeft: "auto" },
      rtl: { marginRight: "auto" }
    }[direction];

    const autoMarginEndValue = {
      ltr: { marginRight: "auto" },
      rtl: { marginLeft: "auto" }
    }[direction];

    const style = {
      ...justify.classStyles,
      ...align.classStyles,
      [`${key}AutoMarginStart`]: autoMarginStartValue,
      [`${key}AutoMarginEnd`]: autoMarginEndValue,
      [`${key}AutoMarginTop`]: { marginTop: "auto" },
      [`${key}AutoMarginBottom`]: { marginBottom: "auto" }
    };

    const classes = {
      ...justify.classNames,
      ...align.classNames,
      [`${key}AutoMarginStart`]: {},
      [`${key}AutoMarginEnd`]: {},
      [`${key}AutoMarginTop`]: {},
      [`${key}AutoMarginBottom`]: {}
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
    fill: { flex: "1 1 auto" },
    autoMarginStart: {
      ltr: { marginLeft: "auto" },
      rtl: { marginRight: "auto" }
    }[theme.direction],
    autoMarginEnd: {
      ltr: { marginRight: "auto" },
      rtl: { marginLeft: "auto" }
    }[theme.direction],
    autoMarginTop: { marginTop: "auto" },
    autoMarginBottom: { marginBottom: "auto" },
    ...baseStyles,
    ...generateResponsiveStyles(theme.breakpoints, theme.direction)
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

      if (typeof value === "boolean") {
        if (value === false) return undefined;

        return key === "default"
          ? classes[camelCase(`${prefix ? prefix : ""}`)]
          : classes[camelCase(`${key}-${prefix ? prefix : ""}`)];
      }

      return key === "default"
        ? classes[camelCase(`${prefix ? prefix + "-" : ""}${value}`)]
        : classes[camelCase(`${key}-${prefix ? prefix + "-" : ""}${value}`)];
    });
  }

  if (typeof prop === "boolean") {
    return prop ? classes[camelCase(`${prefix ? prefix : ""}`)] : undefined;
  }

  return classes[camelCase(`${prefix ? prefix + "-" : ""}${prop}`)];
};

const FlexItem = React.memo(
  React.forwardRef(function FlexItem(props, ref) {
    const {
      className,
      children,
      fill = false,
      autoMarginStart: autoMarginStartProp = false,
      autoMarginTop: autoMarginTopProp = false,
      autoMarginEnd: autoMarginEndProp = false,
      autoMarginBottom: autoMarginBottomProp = false,
      rootNode: RootNode = "div",
      mainAxisSelfAlignment: mainAxisAlignmentProp = "start",
      crossAxisSelfAlignment: crossAxisAlignmentProp = "stretch",
      ...otherProps
    } = props;

    const classes = useStyles();

    const autoMarginStart = getValueOfProp(autoMarginStartProp, false, [
      true,
      false
    ]);

    const autoMarginEnd = getValueOfProp(autoMarginEndProp, false, [
      true,
      false
    ]);

    const autoMarginTop = getValueOfProp(autoMarginTopProp, false, [
      true,
      false
    ]);

    const autoMarginBottom = getValueOfProp(autoMarginBottomProp, false, [
      true,
      false
    ]);

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
          createResponsiveClass(autoMarginStart, classes, "autoMarginStart"),
          createResponsiveClass(autoMarginEnd, classes, "autoMarginEnd"),
          createResponsiveClass(autoMarginTop, classes, "autoMarginTop"),
          createResponsiveClass(autoMarginBottom, classes, "autoMarginBottom"),
          createResponsiveClass(mainAxisAlignment, classes, "justify"),
          createResponsiveClass(crossAxisAlignment, classes, "align"),
          {
            [classes.fill]: fill
          }
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

FlexItem.displayName = componentName;

FlexItem.propTypes = {
  children: PropTypes.node,
  rootNode: PropTypes.elementType,
  className: PropTypes.string,
  mainAxisSelfAlignment: getResponsivePropTypeOf(allowedMainAxisAlignments),
  crossAxisSelfAlignment: getResponsivePropTypeOf(allowedCrossAxisAlignments),
  fill: PropTypes.bool,
  autoMarginStart: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      xxs: PropTypes.bool,
      xs: PropTypes.bool,
      sm: PropTypes.bool,
      md: PropTypes.bool,
      lg: PropTypes.bool,
      xlg: PropTypes.bool
    })
  ]),
  autoMarginEnd: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      xxs: PropTypes.bool,
      xs: PropTypes.bool,
      sm: PropTypes.bool,
      md: PropTypes.bool,
      lg: PropTypes.bool,
      xlg: PropTypes.bool
    })
  ]),
  autoMarginTop: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      xxs: PropTypes.bool,
      xs: PropTypes.bool,
      sm: PropTypes.bool,
      md: PropTypes.bool,
      lg: PropTypes.bool,
      xlg: PropTypes.bool
    })
  ]),
  autoMarginBottom: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      xxs: PropTypes.bool,
      xs: PropTypes.bool,
      sm: PropTypes.bool,
      md: PropTypes.bool,
      lg: PropTypes.bool,
      xlg: PropTypes.bool
    })
  ])
};

export default FlexItem;
