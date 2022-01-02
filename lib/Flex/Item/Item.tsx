/* eslint-disable @typescript-eslint/no-non-null-assertion */
import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import { makeStyles, type Breakpoints, type Direction } from "../../styles";
import type { MergeElementProps } from "../../typings";
import { camelCase, getVar } from "../../utils";

const allowedMainAxisAlignments = [
  "start",
  "end",
  "center",
  "between",
  "around",
  "evenly"
] as const;

const allowedCrossAxisAlignments = [
  "start",
  "end",
  "center",
  "baseline",
  "stretch"
] as const;

type ResponsivePropType<T> =
  | T
  | Partial<Record<Breakpoints["keys"][number] | "fallback", T>>;

interface FlexItemBaseProps {
  /**
   * The content of the component.
   */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Use it on a series of sibling flex items to force them into widths equal to their content
   * (or equal widths if their content does not surpass their border-boxes)
   * while taking up all available horizontal space.
   * @default false
   */
  fill?: boolean;
  /**
   * Changes the alignment of flex item individually on the main axis in the flexbox.
   * @default "start"
   */
  mainAxisSelfAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "between" | "around" | "evenly"
  >;
  /**
   * Changes the alignment of flex item individually on the cross axis in the flexbox.
   * @default "stretch"
   */
  crossAxisSelfAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "baseline" | "stretch"
  >;
  /**
   * Pushes the flex items on the left side to the left.
   * @default false
   */
  autoMarginStart?: ResponsivePropType<boolean>;
  /**
   * Pushes the flex items on the right side to the right.
   * @default false
   */
  autoMarginEnd?: ResponsivePropType<boolean>;
  /**
   * Pushes the above flex items to the top.
   * @default false
   */
  autoMarginTop?: ResponsivePropType<boolean>;
  /**
   * Pushes the bottom flex items to the bottom.
   * @default false
   */
  autoMarginBottom?: ResponsivePropType<boolean>;
}

export type FlexItemProps<T extends React.ElementType = "div"> =
  MergeElementProps<
    T,
    FlexItemBaseProps & {
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      as?: T;
    }
  >;

type Component = {
  <T extends React.ElementType>(props: FlexItemProps<T>): JSX.Element;
  propTypes?: React.WeakValidationMap<FlexItemProps> | undefined;
  displayName?: string | undefined;
};

const baseStyles: Record<string, React.CSSProperties> = {
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

const createClassStyle = (
  validValues: readonly string[],
  key: Breakpoints["keys"][number],
  prefix = ""
) => {
  let classNames: Record<string, React.CSSProperties> = {};

  const classStyles = validValues.reduce((style, value) => {
    const hash = camelCase(`${key}-${prefix ? prefix + "-" : ""}${value}`);
    const baseKey = camelCase(`${prefix ? prefix + "-" : ""}${value}`);

    classNames = { ...classNames, [hash]: {} };

    return {
      ...style,
      [hash]: baseStyles[baseKey]
    };
  }, {} as Record<string, React.CSSProperties>);

  return { classStyles, classNames };
};

const generateResponsiveStyles = (
  breakpoints: Breakpoints,
  direction: Direction
) => {
  const styles = breakpoints.keys.reduce((result, key) => {
    const justify = createClassStyle(allowedMainAxisAlignments, key, "justify");
    const align = createClassStyle(allowedCrossAxisAlignments, key, "align");

    const autoMarginStartValue = {
      ltr: { marginLeft: "auto" },
      rtl: { marginRight: "auto" }
    }[direction];

    const autoMarginStartNoneValue = {
      ltr: { marginLeft: "initial" },
      rtl: { marginRight: "initial" }
    }[direction];

    const autoMarginEndValue = {
      ltr: { marginRight: "auto" },
      rtl: { marginLeft: "auto" }
    }[direction];

    const autoMarginEndNoneValue = {
      ltr: { marginRight: "initial" },
      rtl: { marginLeft: "initial" }
    }[direction];

    const style = {
      ...justify.classStyles,
      ...align.classStyles,
      [`${key}AutoMarginStart`]: autoMarginStartValue,
      [`${key}AutoMarginStartNone`]: autoMarginStartNoneValue,
      [`${key}AutoMarginEnd`]: autoMarginEndValue,
      [`${key}AutoMarginEndNone`]: autoMarginEndNoneValue,
      [`${key}AutoMarginTop`]: { marginTop: "auto" },
      [`${key}AutoMarginTopNone`]: { marginTop: "initial" },
      [`${key}AutoMarginBottom`]: { marginBottom: "auto" },
      [`${key}AutoMarginBottomNone`]: { marginBottom: "initial" }
    };

    const classes = {
      ...justify.classNames,
      ...align.classNames,
      [`${key}AutoMarginStart`]: {},
      [`${key}AutoMarginStartNone`]: {},
      [`${key}AutoMarginEnd`]: {},
      [`${key}AutoMarginEndNone`]: {},
      [`${key}AutoMarginTop`]: {},
      [`${key}AutoMarginTopNone`]: {},
      [`${key}AutoMarginBottom`]: {},
      [`${key}AutoMarginBottomNone`]: {}
    };

    const media = breakpoints.up(key);

    return {
      ...result,
      ...classes,
      [media]: { ...result[media], ...style }
    };
  }, {} as Record<string, React.CSSProperties>);

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
  { name: "SonnatFlexItem" }
);

const getValueOfProp = (
  prop: ResponsivePropType<string | boolean>,
  defaultValue: string | boolean,
  validValues: readonly (string | boolean)[]
) => {
  if (typeof prop !== "object")
    return getVar(prop, defaultValue, !validValues.includes(prop));

  return { fallback: defaultValue, ...prop };
};

const createResponsiveClass = (
  prop: ReturnType<typeof getValueOfProp>,
  classes: Record<string, string>,
  prefix = ""
) => {
  if (typeof prop === "object") {
    return Object.keys(prop).map(key => {
      const value = prop[key as keyof typeof prop];

      if (typeof value === "boolean") {
        if (value === false) return classes[camelCase(`${key}-${prefix}-none`)];

        return key === "fallback"
          ? classes[camelCase(`${prefix}`)]
          : classes[camelCase(`${key}-${prefix}`)];
      }

      return key === "fallback"
        ? classes[camelCase(`${prefix ? prefix + "-" : ""}${value!}`)]
        : classes[camelCase(`${key}-${prefix ? prefix + "-" : ""}${value!}`)];
    });
  }

  if (typeof prop === "boolean") {
    return prop ? classes[camelCase(`${prefix}`)] : undefined;
  }

  return classes[camelCase(`${prefix ? prefix + "-" : ""}${prop}`)];
};

const FlexItemBase = <T extends React.ElementType = "div">(
  props: FlexItemProps<T>,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    className,
    children,
    fill = false,
    autoMarginStart: autoMarginStartProp = false,
    autoMarginTop: autoMarginTopProp = false,
    autoMarginEnd: autoMarginEndProp = false,
    autoMarginBottom: autoMarginBottomProp = false,
    as: RootNode = "div",
    mainAxisSelfAlignment: mainAxisAlignmentProp = "start",
    crossAxisSelfAlignment: crossAxisAlignmentProp = "stretch",
    ...otherProps
  } = props;

  const classes = useStyles();

  const autoMarginStart = getValueOfProp(autoMarginStartProp, false, [
    true,
    false
  ]);

  const autoMarginEnd = getValueOfProp(autoMarginEndProp, false, [true, false]);

  const autoMarginTop = getValueOfProp(autoMarginTopProp, false, [true, false]);

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
      className={c(
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
};

const getResponsivePropTypeOf = (validValues: readonly string[]) => {
  return PropTypes.oneOfType([
    PropTypes.oneOf(validValues),
    PropTypes.shape({
      xxs: PropTypes.oneOf(validValues),
      xs: PropTypes.oneOf(validValues),
      sm: PropTypes.oneOf(validValues),
      md: PropTypes.oneOf(validValues),
      lg: PropTypes.oneOf(validValues),
      xlg: PropTypes.oneOf(validValues),
      fallback: PropTypes.oneOf(validValues)
    })
  ]);
};

const FlexItem = React.forwardRef(FlexItemBase) as Component;

/* eslint-disable @typescript-eslint/ban-ts-comment */
FlexItem.propTypes = {
  children: PropTypes.node,
  // @ts-ignore
  as: PropTypes.elementType,
  className: PropTypes.string,
  fill: PropTypes.bool,
  // @ts-ignore
  mainAxisSelfAlignment: getResponsivePropTypeOf(allowedMainAxisAlignments),
  // @ts-ignore
  crossAxisSelfAlignment: getResponsivePropTypeOf(allowedCrossAxisAlignments),
  // @ts-ignore
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
  // @ts-ignore
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
  // @ts-ignore
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
  // @ts-ignore
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
/* eslint-enable @typescript-eslint/ban-ts-comment */

export default FlexItem;
