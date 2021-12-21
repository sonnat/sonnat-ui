import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import useStyles from "./styles";

interface CardHeaderBase {
  /** The content of the component. */
  children?: React.ReactNode;
  /** The action to display in the header. */
  action?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type CardHeaderProps = MergeElementProps<"div", CardHeaderBase>;

type Component = {
  (props: CardHeaderProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<CardHeaderProps> | undefined;
  displayName?: string | undefined;
};

const CardHeaderBase = (
  props: CardHeaderProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { className, children, action, ...otherProps } = props;

  const classes = useStyles();

  return (
    <div ref={ref} className={c(classes.root, className)} {...otherProps}>
      <div className={classes.body}>{children}</div>
      {action && <div className={classes.action}>{action}</div>}
    </div>
  );
};

const CardHeader = React.forwardRef(CardHeaderBase) as Component;

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  action: PropTypes.node
};

export default CardHeader;
