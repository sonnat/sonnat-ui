// The API is inspired by Material-UI's Skeleton

import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import useStyles from "./styles";

interface SkeletonBaseProps {
  /** Optional children to infer width and height from. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The ratio of the width to the height.
   *
   * Only works when `variant="rectangular"`.
   */
  ratio?: number;
  /**
   * Width of the skeleton.
   * Useful when the skeleton is inside an inline element with no width of its own.
   */
  width?: number | string;
  /**
   * Height of the skeleton.
   * Useful when you don't want to adapt the skeleton to a text element but for instance a card.
   */
  height?: number | string;
  /**
   * The type of content that will be rendered.
   * @default "text"
   */
  variant?: "circular" | "rectangular" | "text";
}

export type SkeletonProps<T extends React.ElementType = "div"> =
  MergeElementProps<
    T,
    SkeletonBaseProps & {
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      as?: T;
    }
  >;

type Component = {
  <T extends React.ElementType>(props: SkeletonProps<T>): JSX.Element;
  propTypes?: React.WeakValidationMap<SkeletonProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["circular", "rectangular", "text"] as const;

const SkeletonBase = (props: SkeletonProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    children,
    className,
    ratio,
    width,
    height,
    style: styleProp = {},
    as: RootNode = "div",
    variant = "text",
    ...otherProps
  } = props;

  const classes = useStyles();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { width: _w, height: _h, ...otherStyleProps } = styleProp;
  const style = { width, height, ...otherStyleProps };

  if (ratio && variant === "rectangular") {
    style.height = 0;
    style.paddingTop = `${100 / ratio}%`;
  } else if (ratio && variant !== "rectangular") {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(
        `Sonnat: You can not use the \`ratio={${ratio}}\` and \`variant="${variant}"\` properties ` +
          "at the same time on a `Skeleton` component."
      );
    }
  }

  return (
    <RootNode
      ref={ref}
      style={style}
      className={c(classes.root, className, {
        [classes[variant]]: allowedVariants.includes(variant),
        [classes.autoHeight]: !!children && !height,
        [classes.autoWidth]: !!children && !width,
        [classes.hasChildren]: !!children
      })}
      {...otherProps}
    >
      {children}
    </RootNode>
  );
};

const Skeleton = React.forwardRef(SkeletonBase) as Component;

Skeleton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  as: PropTypes.elementType,
  style: PropTypes.object,
  ratio: PropTypes.number,
  variant: PropTypes.oneOf(allowedVariants),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Skeleton;
