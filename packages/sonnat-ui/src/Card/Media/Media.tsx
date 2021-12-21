import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import useStyles from "./styles";

interface CardMediaBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type CardMediaProps = MergeElementProps<"div", CardMediaBaseProps>;

type Component = {
  (props: CardMediaProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<CardMediaProps> | undefined;
  displayName?: string | undefined;
};

const CardMediaBase = (
  props: CardMediaProps,
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

const CardMedia = React.forwardRef(CardMediaBase) as Component;

CardMedia.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CardMedia;
