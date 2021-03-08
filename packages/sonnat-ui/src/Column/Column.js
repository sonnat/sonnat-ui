import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import { gridNumbers } from "../utils/enums";
import makeStyles from "../styles/makeStyles";
import useTheme from "../styles/useTheme";

const componentName = "Column";

const generateClass = (style, { breakpoints, direction }, key) => {
  const _styles = {};

  gridNumbers.forEach(size => {
    if (typeof size === "string") return;

    // Keep 7 significant numbers.
    const width = `${Math.round((size / 12) * 10e7) / 10e5}%`;

    const predefinedStyles = {
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
      order: {
        order: `${size}`
      }
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
};

const useStyles = makeStyles(
  theme => {
    const {
      breakpoints,
      direction,
      spacings: { gutter },
      typography: { pxToRem, fontFamily }
    } = theme;

    const classes = breakpoints.keys.reduce((style, key) => {
      return generateClass(style, { direction, breakpoints }, key);
    }, {});

    return {
      root: {
        position: "relative",
        direction,
        fontFamily: fontFamily[direction],
        width: "100%",
        paddingRight: pxToRem(gutter / 2),
        paddingLeft: pxToRem(gutter / 2),
        maxWidth: "100%",
        flexBasis: "0",
        flexGrow: "1"
      },
      ...classes
    };
  },
  { name: `Sonnat${componentName}` }
);

const Column = React.memo(
  React.forwardRef(function Column(props, ref) {
    const { children, className, all, ...otherProps } = props;

    const localClass = useStyles();
    const theme = useTheme();

    let generatedClasses = [];

    if (all != null) {
      if (typeof all === "string" || typeof all === "number") {
        const size = all;

        generatedClasses = [...generatedClasses, localClass[`column${size}`]];
      } else if (typeof all === "object") {
        const { size, order, offset } = all;

        if (size != null) {
          generatedClasses = [...generatedClasses, localClass[`column${size}`]];
        }

        if (order != null) {
          generatedClasses = [...generatedClasses, localClass[`order${order}`]];
        }

        if (offset != null) {
          generatedClasses = [
            ...generatedClasses,
            localClass[`offset${offset}`]
          ];
        }
      }
    }

    theme.breakpoints.keys.forEach(breakpoint => {
      const prop = otherProps[breakpoint];

      if (prop != null) {
        if (typeof prop === "string" || typeof prop === "number") {
          const size = prop;

          if (size) {
            generatedClasses = [
              ...generatedClasses,
              localClass[`${breakpoint}Column${size}`]
            ];
          }
        } else if (typeof prop === "object") {
          const { size, order, offset } = prop;

          if (size != null) {
            generatedClasses = [
              ...generatedClasses,
              localClass[`${breakpoint}Column${size}`]
            ];
          }

          if (order != null) {
            generatedClasses = [
              ...generatedClasses,
              localClass[`${breakpoint}Order${order}`]
            ];
          }

          if (offset != null) {
            generatedClasses = [
              ...generatedClasses,
              localClass[`${breakpoint}Offset${offset}`]
            ];
          }
        }
      }
    });

    // eslint-disable-next-line no-unused-vars
    const { xxs, xs, sm, md, lg, xlg, ...otherColumnProps } = otherProps;

    return (
      <div
        ref={ref}
        className={createClass(localClass.root, className, ...generatedClasses)}
        {...otherColumnProps}
      >
        {children}
      </div>
    );
  })
);

Column.displayName = componentName;

Column.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  all: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  xxs: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  xs: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  sm: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  md: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  lg: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  xlg: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ])
};

export default Column;