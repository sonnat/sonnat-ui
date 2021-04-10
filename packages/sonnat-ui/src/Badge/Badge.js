import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";

const componentName = "Badge";
const allowedVariants = ["filled", "dotted"];
const allowedSizes = ["large", "medium", "small"];
const allowedColors = ["primary", "secondary"];
const allowedChildShapes = ["rectangular", "circular"];
const allowedHorizontalPositions = ["left", "right"];
const allowedVerticalPositions = ["top", "bottom"];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      hacks,
      typography: { pxToRem, fontWeight, useText, fontFamily }
    } = theme;

    return {
      root: {
        ...hacks.safariTransitionRadiusOverflowCombinationFix,
        position: "relative",
        flexShrink: 0,
        verticalAlign: "middle"
      },
      standalone: {
        transform: "scale(0)",
        visibility: "hidden",
        opacity: 0,
        transformOrigin: "100% 0",
        transition: `transform 360ms ease,
          visibility 360ms ease,
          opacity 360ms ease`
      },
      relative: {
        display: "inline-flex",
        "& > $standalone": {
          position: "absolute"
        }
      },
      visible: {
        visibility: "visible",
        opacity: 1,
        transform: "scale(1)"
      },
      notDottedBadge: {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        ...useText({
          fontSize: pxToRem(10),
          fontWeight: fontWeight.medium,
          lineHeight: 1.65
        }),
        direction,
        fontFamily: fontFamily[direction],
        textAlign: "center !important",
        minWidth: pxToRem(16),
        height: pxToRem(16),
        borderRadius: pxToRem(8),
        display: "inline-block",
        padding: `0 ${pxToRem(4)}`
      },
      filled: { extend: "notDottedBadge" },
      dotted: { borderRadius: "50%", display: "inline-block" },
      filledPrimary: {
        backgroundColor: !darkMode
          ? colors.primary.origin
          : colors.primary.light,
        color: colors.getContrastColorOf(
          !darkMode ? colors.primary.origin : colors.primary.light
        )
      },
      filledSecondary: {
        backgroundColor: !darkMode
          ? colors.secondary.origin
          : colors.secondary.light,
        color: colors.getContrastColorOf(
          !darkMode ? colors.secondary.origin : colors.secondary.light
        )
      },
      dottedPrimary: {
        backgroundColor: !darkMode
          ? colors.primary.origin
          : colors.primary.light
      },
      dottedSecondary: {
        backgroundColor: !darkMode
          ? colors.secondary.origin
          : colors.secondary.light
      },
      large: { width: pxToRem(12), height: pxToRem(12) },
      medium: { width: pxToRem(8), height: pxToRem(8) },
      small: { width: pxToRem(4), height: pxToRem(4) },
      anchorElement: {},
      rectangularOverlapping: {},
      circularOverlapping: {},
      topLeft: {
        top: 0,
        left: 0,
        "&$rectangularOverlapping": { top: "0", left: "0" },
        "&$circularOverlapping": { top: "15%", left: "15%" },
        "&$visible": { transform: "scale(1) translate(-50%, -50%)" },
        "&:not($visible)": { transform: "scale(0) translate(-50%, -50%)" }
      },
      topRight: {
        top: 0,
        right: 0,
        "&$rectangularOverlapping": { top: "0", right: "0" },
        "&$circularOverlapping": { top: "15%", right: "15%" },
        "&$visible": { transform: "scale(1) translate(50%, -50%)" },
        "&:not($visible)": { transform: "scale(0) translate(50%, -50%)" }
      },
      bottomLeft: {
        bottom: 0,
        left: 0,
        "&$rectangularOverlapping": { bottom: "0", left: "0" },
        "&$circularOverlapping": { bottom: "15%", left: "15%" },
        "&$visible": { transform: "scale(1) translate(-50%, 50%)" },
        "&:not($visible)": { transform: "scale(0) translate(-50%, 50%)" }
      },
      bottomRight: {
        bottom: 0,
        right: 0,
        "&$rectangularOverlapping": { bottom: "0", right: "0" },
        "&$circularOverlapping": { bottom: "15%", right: "15%" },
        "&$visible": { transform: "scale(1) translate(50%, 50%)" },
        "&:not($visible)": { transform: "scale(0) translate(50%, 50%)" }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Badge = React.memo(
  React.forwardRef(function Badge(props, ref) {
    const {
      className,
      textContent,
      parentProps: parentPropsProp = {},
      childShape = "rectangular",
      children: childrenProp,
      horizontalPosition = "right",
      verticalPosition = "top",
      color = "primary",
      variant = "filled",
      dotSize = "medium",
      visible = true,
      ...otherProps
    } = props;

    const { className: parentClassName, ...parentProps } = parentPropsProp;

    const localClass = useStyles();

    const isDotted = variant === "dotted";
    const isVisible = visible === true;

    const hasValidVariant = allowedVariants.includes(variant);
    const hasValidColor = allowedColors.includes(color);
    const hasValidChildShape = allowedChildShapes.includes(childShape);
    const hasValidDotSize = allowedSizes.includes(dotSize);

    let children;

    if (childrenProp != null && React.isValidElement(childrenProp)) {
      try {
        children = React.Children.only(childrenProp);
      } catch (err) {
        throw new Error(
          `[Sonnat]: The \`children\` prop has to be a single valid element.`
        );
      }
    }

    const positionClass =
      localClass[camelCase(`${verticalPosition}-${horizontalPosition}`)];

    const createRelativeBadge = () => {
      return (
        <div
          ref={ref}
          className={createClass(
            localClass.root,
            localClass.relative,
            parentClassName,
            className
          )}
          {...parentProps}
        >
          {createStandaloneBadge(
            createClass(positionClass, {
              [localClass[`${childShape}Overlapping`]]: hasValidChildShape
            }),
            true
          )}
          {React.cloneElement(children, {
            className: createClass(
              children.props.className,
              localClass.anchorElement
            )
          })}
        </div>
      );
    };

    const createStandaloneBadge = (classes, hasParent = false) => {
      return (
        <span
          ref={ref}
          className={createClass(
            localClass.standalone,
            localClass.root,
            classes,
            hasParent ? undefined : parentClassName,
            className,
            {
              [localClass.visible]: isVisible,
              [localClass[camelCase(`${variant}-${color}`)]]:
                hasValidVariant && hasValidColor,
              [localClass[dotSize]]: hasValidDotSize && isDotted,
              [localClass[variant]]: hasValidVariant
            }
          )}
          {...(hasParent ? otherProps : { ...otherProps, ...parentProps })}
        >
          {!isDotted ? textContent : null}
        </span>
      );
    };

    return isDotted || (!isDotted && textContent)
      ? children
        ? createRelativeBadge()
        : createStandaloneBadge()
      : null;
  })
);

Badge.displayName = componentName;

Badge.propTypes = {
  children: PropTypes.element,
  parentProps: PropTypes.object,
  textContent: PropTypes.string,
  className: PropTypes.string,
  visible: PropTypes.bool,
  horizontalPosition: PropTypes.oneOf(allowedHorizontalPositions),
  verticalPosition: PropTypes.oneOf(allowedVerticalPositions),
  childShape: PropTypes.oneOf(allowedChildShapes),
  dotSize: PropTypes.oneOf(allowedSizes),
  color: PropTypes.oneOf(allowedColors),
  variant: PropTypes.oneOf(allowedVariants)
};

export default Badge;
