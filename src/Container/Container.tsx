import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import useStyles from "./styles";

interface BaseProps {
  /** The content of the container. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Determine whether the container should be fluid (max-width: 100%) or not.
   *
   * If `true`, the container will be fluid in all breakpoints.
   * If `false`, the container will not be fluid.
   *
   * If set to breakpoint ("xxs", "xs" and etc.), It will be applied for that breakpoint and wider screens.
   * @default false
   */
  fluid?: boolean | "xxs" | "xs" | "sm" | "md" | "lg" | "xlg";
  /**
   * If `true`, the paddings will be removed.
   * @default false
   */
  noPadding?: boolean;
}

export type ContainerProps = MergeElementProps<"div", BaseProps>;

type Component = {
  (props: ContainerProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<ContainerProps> | undefined;
  displayName?: string | undefined;
};

const ContainerBase = (
  props: ContainerProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    children,
    className,
    fluid = false,
    noPadding = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  return (
    <div
      ref={ref}
      className={c(
        classes.root,
        typeof fluid === "boolean"
          ? { [classes.fluid]: fluid }
          : classes[`${fluid}Fluid`],
        className,
        { [classes.noPadding]: noPadding }
      )}
      {...otherProps}
    >
      {children}
    </div>
  );
};

const Container = React.forwardRef(ContainerBase) as Component;

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  noPadding: PropTypes.bool,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  fluid: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.oneOf(["xxs", "xs", "sm", "md", "lg", "xlg"])
  ])
};

export default Container;
