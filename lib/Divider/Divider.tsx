import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import useStyles from "./styles";

interface DividerBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the divider will have spaces around it.
   * @default false
   */
  spaced?: boolean;
  /**
   * If `true`, the divider will be rendered as 3-dots instead of a straight line.
   *
   * You can't use `dotted` along with `vertical`!
   * @default false
   */
  dotted?: boolean;
  /**
   * If `true`, the divider will be vertical.
   *
   * It only works in flexboxes!
   * (the parent should be a flexbox and the divider itself has to be a flex-item)
   * @default false
   */
  vertical?: boolean;
}

export type DividerProps<T extends React.ElementType = "hr"> =
  MergeElementProps<
    T,
    DividerBaseProps & {
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      as?: T;
    }
  >;

type Component = {
  <T extends React.ElementType>(props: DividerProps<T>): JSX.Element;
  propTypes?: React.WeakValidationMap<DividerProps> | undefined;
  displayName?: string | undefined;
};

const DividerBase = (props: DividerProps) => {
  const {
    className,
    as: RootNode = "hr",
    spaced = false,
    dotted = false,
    vertical = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  return (
    <RootNode
      role="separator"
      className={c(classes.root, className, {
        [classes.spaced]: spaced,
        [classes.dotted]: dotted,
        [classes.vertical]: vertical
      })}
      {...otherProps}
    />
  );
};

const Divider = DividerBase as Component;

Divider.propTypes = {
  className: PropTypes.string,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  as: PropTypes.elementType,
  spaced: PropTypes.bool,
  dotted: PropTypes.bool,
  vertical: PropTypes.bool
};

export default Divider;
