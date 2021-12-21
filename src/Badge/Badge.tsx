import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps, NotUndefined } from "../typings";
import { camelCase, getVar } from "../utils";
import useStyles, { PositionCombo, VariantColorCombo } from "./styles";

interface BadgeBaseProps {
  /**
   * If provided the badge will be wrapped around this node.
   */
  children?: React.ReactElement<{ className?: string }>;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The text content of the badge.
   */
  text?: string;
  /**
   * The props of the parent.
   *
   * If component has `children`,
   * this will be applied to the container of badge and the children element.
   * Otherwise this will be applied to the badge itself.
   */
  parentProps?: React.ComponentPropsWithRef<"div">;
  /**
   * The horizontal position of the badge.
   * @default "right"
   */
  horizontalPosition?: "left" | "right";
  /**
   * The vertical position of the badge.
   * @default "top"
   */
  verticalPosition?: "top" | "bottom";
  /**
   * The shape of the child the badge will be wrapped around.
   *
   * Set this for better positioning.
   * * @default "rectangular"
   */
  childShape?: "rectangular" | "circular";
  /**
   * The size of the badge when `variant="dotted"`.
   * @default "medium"
   */
  dotSize?: "large" | "medium" | "small";
  /**
   * The variant of the badge.
   * @default "filled"
   */
  variant?: "filled" | "dotted";
  /**
   * The color of the badge.
   * @default "default"
   */
  color?: "primary" | "secondary";
  /**
   * 	If `true`, the badge will be visible.
   * @default true
   */
  visible?: boolean;
}

export type BadgeProps = MergeElementProps<"div", BadgeBaseProps>;

type Component = {
  (props: BadgeProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<BadgeProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["filled", "dotted"] as const;
const allowedSizes = ["large", "medium", "small"] as const;
const allowedColors = ["primary", "secondary"] as const;
const allowedChildShapes = ["rectangular", "circular"] as const;
const allowedHorizontalPositions = ["left", "right"] as const;
const allowedVerticalPositions = ["top", "bottom"] as const;

const BadgeBase = (props: BadgeProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className,
    text,
    parentProps: parentPropsProp = {},
    childShape: shapeProp = "rectangular",
    children: childrenProp,
    horizontalPosition: hPosProp = "right",
    verticalPosition: vPosProp = "top",
    color: colorProp = "primary",
    variant: variantProp = "filled",
    dotSize: dotSizeProp = "medium",
    visible = true,
    ...otherProps
  } = props;

  const { className: parentClassName, ...parentProps } = parentPropsProp;

  const classes = useStyles();

  const horizontalPosition = getVar(
    hPosProp,
    "right",
    !allowedHorizontalPositions.includes(hPosProp)
  );

  const verticalPosition = getVar(
    vPosProp,
    "top",
    !allowedVerticalPositions.includes(vPosProp)
  );

  const variant = getVar(
    variantProp,
    "filled",
    !allowedVariants.includes(variantProp)
  );

  const color = getVar(
    colorProp,
    "primary",
    !allowedColors.includes(colorProp)
  );

  const dotSize = getVar(
    dotSizeProp,
    "medium",
    !allowedSizes.includes(dotSizeProp)
  );

  const childShape = getVar(
    shapeProp,
    "rectangular",
    !allowedChildShapes.includes(shapeProp)
  );

  const isDotted = variant === "dotted";
  const isVisible = visible === true;

  let children: BadgeProps["children"];

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
    classes[
      camelCase(`${verticalPosition}-${horizontalPosition}`) as PositionCombo
    ];

  const createRelativeBadge = () => {
    return (
      <div
        ref={ref}
        className={c(
          classes.root,
          classes.relative,
          parentClassName,
          className
        )}
        {...parentProps}
      >
        {createStandaloneBadge(
          c(positionClass, classes[`${childShape}Overlapping`]),
          true
        )}
        {React.cloneElement(children as NotUndefined<typeof children>, {
          className: c(
            (children as NotUndefined<typeof children>).props.className,
            classes.anchorElement
          )
        })}
      </div>
    );
  };

  const createStandaloneBadge = (classNames?: string, hasParent = false) => {
    return (
      <span
        ref={ref}
        className={c(
          classes.standalone,
          classes.root,
          className,
          classNames,
          hasParent ? undefined : parentClassName,
          classes[camelCase(`${variant}-${color}`) as VariantColorCombo],
          classes[variant],
          {
            [classes.visible]: isVisible,
            [classes[dotSize]]: isDotted
          }
        )}
        {...(hasParent ? otherProps : { ...otherProps, ...parentProps })}
      >
        {!isDotted ? text : null}
      </span>
    );
  };

  return isDotted || (!isDotted && text)
    ? children
      ? createRelativeBadge()
      : createStandaloneBadge()
    : null;
};

const Badge = React.forwardRef(BadgeBase) as Component;

Badge.propTypes = {
  children: PropTypes.element,
  parentProps: PropTypes.object,
  text: PropTypes.string,
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
