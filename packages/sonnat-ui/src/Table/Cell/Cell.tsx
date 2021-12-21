import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import camelCase from "../../utils/camelCase";
import TableContext from "../context";
import TableInnerContext from "../innerContext";
import TableRowContext from "../Row/context";
import useStyles, { AlignCombo } from "./styles";

interface TableCellBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Set the `text-align` css property of the table cell.
   * @default "inherit"
   */
  textAlign?: "inherit" | "center" | "justify" | "left" | "right";
}

export type TableCellProps = MergeElementProps<"td" | "th", TableCellBaseProps>;

type Component = {
  (props: TableCellProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TableCellProps> | undefined;
  displayName?: string | undefined;
};

const allowedTextAligns = [
  "inherit",
  "center",
  "justify",
  "left",
  "right"
] as const;

const TableCellBase = (
  props: TableCellProps,
  ref: React.Ref<HTMLTableCellElement>
) => {
  const { className, children, textAlign = "inherit", ...otherProps } = props;

  const innerContext = React.useContext(TableInnerContext);
  const tableContext = React.useContext(TableContext);
  const rowContext = React.useContext(TableRowContext);

  const classes = useStyles();

  const RootNode = innerContext?.cellVariant === "header" ? "th" : "td";

  return (
    <RootNode
      ref={ref}
      className={c(
        className,
        classes.root,
        !!innerContext?.cellVariant &&
          classes[`${innerContext.cellVariant}Cell`],
        classes[camelCase(`text-align-${textAlign}`) as AlignCombo],
        {
          [classes.dense]: tableContext?.isDense,
          [classes.selected]: rowContext?.isSelected
        }
      )}
      {...otherProps}
    >
      {children}
    </RootNode>
  );
};

const TableCell = React.forwardRef(TableCellBase) as Component;

TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  textAlign: PropTypes.oneOf(allowedTextAligns)
};

export default TableCell;
