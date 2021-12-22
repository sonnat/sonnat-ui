import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import useStyles from "./styles";

interface RowBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type RowProps = MergeElementProps<"div", RowBaseProps>;

type Component = {
  (props: RowProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<RowProps> | undefined;
  displayName?: string | undefined;
};

const RowBase = (props: RowProps, ref: React.Ref<HTMLDivElement>) => {
  const { children, className, ...otherProps } = props;

  const classes = useStyles();

  return (
    <div ref={ref} className={c(classes.root, className)} {...otherProps}>
      {children}
    </div>
  );
};

const Row = React.forwardRef(RowBase) as Component;

Row.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node
};

export default Row;
