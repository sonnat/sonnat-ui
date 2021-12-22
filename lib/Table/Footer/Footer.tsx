import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import makeStyles from "../../styles/makeStyles";
import type { MergeElementProps } from "../../typings";
import TableInnerContext from "../innerContext";

interface TableFooterBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type TableFooterProps = MergeElementProps<"tfoot", TableFooterBaseProps>;

type Component = {
  (props: TableFooterProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TableFooterProps> | undefined;
  displayName?: string | undefined;
};

const useStyles = makeStyles(
  { root: { display: "table-footer-group" } },
  { name: "SonnatTableFooter" }
);

const TableFooterBase = (
  props: TableFooterProps,
  ref: React.Ref<HTMLTableSectionElement>
) => {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();

  return (
    <tfoot ref={ref} className={c(className, classes.root)} {...otherProps}>
      <TableInnerContext.Provider value={{ cellVariant: "footer" }}>
        {children}
      </TableInnerContext.Provider>
    </tfoot>
  );
};

const TableFooter = React.forwardRef(TableFooterBase) as Component;

TableFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default TableFooter;
