import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import useStyles from "./styles";

interface CardActionBarBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type CardActionBarProps = MergeElementProps<
  "div",
  CardActionBarBaseProps
>;

type Component = {
  (props: CardActionBarProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<CardActionBarProps> | undefined;
  displayName?: string | undefined;
};

const CardActionBarBase = (
  props: CardActionBarProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();

  return (
    <div ref={ref} className={c(classes.root, className)} {...otherProps}>
      {children}
    </div>
  );
};

const CardActionBar = React.forwardRef(CardActionBarBase) as Component;

CardActionBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CardActionBar;
