import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import useStyles from "./styles";

interface CardBodyBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type CardBodyProps = MergeElementProps<"div", CardBodyBaseProps>;

type Component = {
  (props: CardBodyProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<CardBodyProps> | undefined;
  displayName?: string | undefined;
};

const CardBodyBase = (props: CardBodyProps, ref: React.Ref<HTMLDivElement>) => {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();

  return (
    <div ref={ref} className={c(classes.root, className)} {...otherProps}>
      {children}
    </div>
  );
};

const CardBody = React.forwardRef(CardBodyBase) as Component;

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CardBody;
