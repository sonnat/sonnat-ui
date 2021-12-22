import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import makeStyles from "../../styles/makeStyles";
import type { MergeElementProps } from "../../typings";
import TableInnerContext from "../innerContext";

interface TableHeaderBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type TableHeaderProps = MergeElementProps<"thead", TableHeaderBaseProps>;

type Component = {
  (props: TableHeaderProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TableHeaderProps> | undefined;
  displayName?: string | undefined;
};

const useStyles = makeStyles(
  { root: { display: "table-header-group" } },
  { name: "SonnatTableHeader" }
);

const TableHeaderBase = (
  props: TableHeaderProps,
  ref: React.Ref<HTMLTableSectionElement>
) => {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();

  return (
    <thead ref={ref} className={c(className, classes.root)} {...otherProps}>
      <TableInnerContext.Provider value={{ cellVariant: "header" }}>
        {children}
      </TableInnerContext.Provider>
    </thead>
  );
};

const TableHeader = React.forwardRef(TableHeaderBase) as Component;

TableHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default TableHeader;
