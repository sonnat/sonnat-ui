import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import makeStyles from "../../styles/makeStyles";
import type { MergeElementProps } from "../../typings";
import TableInnerContext from "../innerContext";

interface TableBodyBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type TableBodyProps = MergeElementProps<"tbody", TableBodyBaseProps>;

type Component = {
  (props: TableBodyProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TableBodyProps> | undefined;
  displayName?: string | undefined;
};

const useStyles = makeStyles(
  { root: { display: "table-row-group" } },
  { name: "SonnatTableBody" }
);

const TableBodyBase = (
  props: TableBodyProps,
  ref: React.Ref<HTMLTableSectionElement>
) => {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();

  return (
    <tbody ref={ref} className={c(className, classes.root)} {...otherProps}>
      <TableInnerContext.Provider value={{ cellVariant: "body" }}>
        {children}
      </TableInnerContext.Provider>
    </tbody>
  );
};

const TableBody = React.forwardRef(TableBodyBase) as Component;

TableBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default TableBody;
