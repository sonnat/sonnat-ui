/* eslint-disable @typescript-eslint/no-non-null-assertion */
import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import { makeStyles, type Breakpoints, type DefaultTheme } from "../styles";
import type { MergeElementProps } from "../typings";
import { camelCase, getVar } from "../utils";

const allowedVariants = ["inline", "block"] as const;
const allowedWraps = ["nowrap", "wrap", "wrap-reverse"] as const;
const allowedDirections = [
  "row",
  "column",
  "row-reverse",
  "column-reverse"
] as const;

const allowedContentAlignments = [
  "start",
  "end",
  "center",
  "between",
  "around",
  "evenly",
  "stretch"
] as const;

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

const allowedGaps = ["xxs", "xs", "sm", "md", "lg", "xlg"] as const;

type ResponsivePropType<T> =
  | T
  | Partial<Record<Breakpoints["keys"][number] | "fallback", T>>;

interface FlexBaseProps {
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
   * The variant of the flexbox.
   * @default "block"
   */
  variant?: ResponsivePropType<"block" | "inline">;
  /**
   * Changes how flex items wrap in the flexbox.
   * @default "nowrap"
   */
  wrap?: ResponsivePropType<"nowrap" | "wrap" | "wrap-reverse">;
  /**
   * Sets the gap between flex items in the flexbox.
   */
  gap?: ResponsivePropType<"xxs" | "xs" | "sm" | "md" | "lg" | "xlg">;
  /**
   * Sets the direction of flex items in the flexbox.
   * @default "row"
   */
  direction?: ResponsivePropType<
    "row" | "column" | "row-reverse" | "column-reverse"
  >;
  /**
   * Changes the alignment of flex items on the main axis in the flexbox.
   * @default "start"
   */
  mainAxisAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "between" | "around" | "evenly"
  >;
  /**
   * Changes the alignment of flex items on the cross axis in the flexbox.
   * @default "stretch"
   */
  crossAxisAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "baseline" | "stretch"
  >;
  /**
   * Aligns flex items together on the cross axis in the flexbox.
   * (Note: This property has no effect on single rows of flex items.)
   * @default "start"
   */
  contentAlignment?: ResponsivePropType<
    "start" | "end" | "center" | "between" | "around" | "evenly" | "stretch"
  >;
}

export type FlexProps<T extends React.ElementType = "div"> = MergeElementProps<
  T,
  FlexBaseProps & {
    /**
     * The component used for the root node.
     * Either a string to use a HTML element or a component.
     */
    as?: T;
  }
>;

type Component = {
  <T extends React.ElementType = "div">(props: FlexProps<T>): JSX.Element;
  propTypes?: React.WeakValidationMap<FlexProps> | undefined;
  displayName?: string | undefined;
};

const createBaseStyles = (
  theme: DefaultTheme
): Record<string, React.CSSProperties> => ({
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
  wrapReverse: { flexWrap: "wrap-reverse" },
  gapXxs: { gap: theme.typography.pxToRem(4) },
  gapXs: { gap: theme.typography.pxToRem(8) },
  gapSm: { gap: theme.typography.pxToRem(16) },
  gapMd: { gap: theme.typography.pxToRem(24) },
  gapLg: { gap: theme.typography.pxToRem(32) },
  gapXlg: { gap: theme.typography.pxToRem(48) }
});

const createClassStyle = (
  theme: DefaultTheme,
  validValues: readonly string[],
  key: Breakpoints["keys"][number],
  prefix = ""
) => {
  let classNames: Record<string, React.CSSProperties> = {};
  const baseStyles = createBaseStyles(theme);

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

const generateResponsiveStyles = (theme: DefaultTheme) => {
  const styles = theme.breakpoints.keys.reduce((result, key) => {
    const variants = createClassStyle(theme, allowedVariants, key);
    const wraps = createClassStyle(theme, allowedWraps, key);
    const gaps = createClassStyle(theme, allowedGaps, key, "gap");
    const dirs = createClassStyle(theme, allowedDirections, key);
    const content = createClassStyle(
      theme,
      allowedContentAlignments,
      key,
      "content"
    );
    const justify = createClassStyle(
      theme,
      allowedMainAxisAlignments,
      key,
      "justify"
    );
    const align = createClassStyle(
      theme,
      allowedCrossAxisAlignments,
      key,
      "align"
    );

    const style = {
      ...variants.classStyles,
      ...wraps.classStyles,
      ...gaps.classStyles,
      ...dirs.classStyles,
      ...content.classStyles,
      ...justify.classStyles,
      ...align.classStyles
    };

    const classes = {
      ...variants.classNames,
      ...wraps.classNames,
      ...gaps.classNames,
      ...dirs.classNames,
      ...content.classNames,
      ...justify.classNames,
      ...align.classNames
    };

    const media = theme.breakpoints.up(key);

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
    ...createBaseStyles(theme),
    ...generateResponsiveStyles(theme)
  }),
  { name: "SonnatFlex" }
);

const createResponsiveClass = (
  prop: ReturnType<typeof getValueOfProp>,
  classes: Record<string, string>,
  prefix = ""
) => {
  if (prop == null) return undefined;
  if (typeof prop === "object") {
    return Object.keys(prop).map(key => {
      const value = prop[key as keyof typeof prop];

      return key === "fallback"
        ? classes[camelCase(`${prefix ? prefix + "-" : ""}${value!}`)]
        : classes[camelCase(`${key}-${prefix ? prefix + "-" : ""}${value!}`)];
    });
  }

  return classes[camelCase(`${prefix ? prefix + "-" : ""}${prop}`)];
};

const getValueOfProp = (
  prop: ResponsivePropType<string> | undefined,
  defaultValue: string | undefined,
  validValues: readonly string[]
) => {
  if (prop == null) return;

  if (typeof prop !== "object")
    return defaultValue == null
      ? validValues.includes(prop)
        ? prop
        : undefined
      : getVar(prop, defaultValue, !validValues.includes(prop));

  return { fallback: defaultValue, ...prop };
};

const FlexBase = <T extends React.ElementType = "div">(
  props: FlexProps<T>,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    className,
    children,
    gap: gapProp,
    as: RootNode = "div",
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
  const gap = getValueOfProp(gapProp, undefined, allowedGaps);
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
      className={c(
        className,
        classes.root,
        createResponsiveClass(variant, classes),
        createResponsiveClass(gap, classes, "gap"),
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

const Flex = React.forwardRef(FlexBase) as Component;

/* eslint-disable @typescript-eslint/ban-ts-comment */
Flex.propTypes = {
  children: PropTypes.node,
  // @ts-ignore
  as: PropTypes.elementType,
  className: PropTypes.string,
  variant: PropTypes.oneOf(allowedVariants),
  // @ts-ignore
  gap: getResponsivePropTypeOf(allowedGaps),
  // @ts-ignore
  wrap: getResponsivePropTypeOf(allowedWraps),
  // @ts-ignore
  direction: getResponsivePropTypeOf(allowedDirections),
  // @ts-ignore
  mainAxisAlignment: getResponsivePropTypeOf(allowedMainAxisAlignments),
  // @ts-ignore
  crossAxisAlignment: getResponsivePropTypeOf(allowedCrossAxisAlignments),
  // @ts-ignore
  contentAlignment: getResponsivePropTypeOf(allowedContentAlignments)
};
/* eslint-enable @typescript-eslint/ban-ts-comment */

export default Flex;
