import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import useTheme from "../styles/useTheme";
import type { MergeElementProps } from "../typings";
import useStyles, { gridNumbers, type GridNumbers } from "./styles";

type BreakpointPropertyValue =
  | GridNumbers
  | {
      /** The column's size. */
      size?: GridNumbers;
      /** The flexbox's `order` property of the column. */
      order?: GridNumbers;
      /** The column's offset.
       * (offset from right if its 'right to left' and offset from left if its 'left to right'.)
       */
      offset?: GridNumbers;
    };

interface BaseProps {
  /** The content of the column. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the all breakpoints if not overridden.
   */
  all?: BreakpointPropertyValue;
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `xxs` breakpoint and wider screens if not overridden.
   */
  xxs?: BreakpointPropertyValue;
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `xs` breakpoint and wider screens if not overridden.
   */
  xs?: BreakpointPropertyValue;
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `sm` breakpoint and wider screens if not overridden.
   */
  sm?: BreakpointPropertyValue;
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `md` breakpoint and wider screens if not overridden.
   */
  md?: BreakpointPropertyValue;
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `lg` breakpoint and wider screens if not overridden.
   */
  lg?: BreakpointPropertyValue;
  /**
   * Defines the number of grids the component is going to use.
   * It's applied for the `xlg` breakpoint and wider screens if not overridden.
   */
  xlg?: BreakpointPropertyValue;
}

export type ColumnProps = MergeElementProps<"div", BaseProps>;

type Component = {
  (props: ColumnProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<ColumnProps> | undefined;
  displayName?: string | undefined;
};

const ColumnBase = (props: ColumnProps, ref: React.Ref<HTMLDivElement>) => {
  const { children, className, all, ...otherProps } = props;

  const classes = useStyles();
  const theme = useTheme();

  let generatedClasses: string[] = [];

  if (all != null) {
    if (typeof all === "number") {
      generatedClasses = [
        ...generatedClasses,
        classes[`column${all}` as keyof typeof classes]
      ];
    } else if (typeof all === "object") {
      const { size, order, offset } = all;

      if (size != null)
        generatedClasses = [
          ...generatedClasses,
          classes[`column${size}` as keyof typeof classes]
        ];

      if (order != null)
        generatedClasses = [
          ...generatedClasses,
          classes[`order${order}` as keyof typeof classes]
        ];

      if (offset != null)
        generatedClasses = [
          ...generatedClasses,
          classes[`offset${offset}` as keyof typeof classes]
        ];
    }
  }

  theme.breakpoints.keys.forEach(breakpoint => {
    const prop = otherProps[breakpoint];

    if (prop != null) {
      if (typeof prop === "number") {
        generatedClasses = [
          ...generatedClasses,
          classes[`${breakpoint}Column${prop}` as keyof typeof classes]
        ];
      } else if (typeof prop === "object") {
        const { size, order, offset } = prop;

        if (size != null) {
          generatedClasses = [
            ...generatedClasses,
            classes[`${breakpoint}Column${size}` as keyof typeof classes]
          ];
        }

        if (order != null) {
          generatedClasses = [
            ...generatedClasses,
            classes[`${breakpoint}Order${order}` as keyof typeof classes]
          ];
        }

        if (offset != null) {
          generatedClasses = [
            ...generatedClasses,
            classes[`${breakpoint}Offset${offset}` as keyof typeof classes]
          ];
        }
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { xxs, xs, sm, md, lg, xlg, ...otherColumnProps } = otherProps;

  return (
    <div
      ref={ref}
      className={c(classes.root, className, ...generatedClasses)}
      {...otherColumnProps}
    >
      {children}
    </div>
  );
};

const Column = React.forwardRef(ColumnBase) as Component;

/* eslint-disable @typescript-eslint/ban-ts-comment */
Column.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  // @ts-ignore
  all: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  // @ts-ignore
  xxs: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  // @ts-ignore
  xs: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  // @ts-ignore
  sm: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  // @ts-ignore
  md: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  // @ts-ignore
  lg: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ]),
  // @ts-ignore
  xlg: PropTypes.oneOfType([
    PropTypes.shape({
      size: PropTypes.oneOf(gridNumbers),
      order: PropTypes.oneOf(gridNumbers),
      offset: PropTypes.oneOf(gridNumbers)
    }),
    PropTypes.oneOf(gridNumbers)
  ])
};
/* eslint-enable @typescript-eslint/ban-ts-comment */

export default Column;
