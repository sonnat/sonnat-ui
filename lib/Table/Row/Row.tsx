import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import camelCase from "../../utils/camelCase";
import TableRowContext from "./context";
import useStyles, { type AlignCombo } from "./styles";

interface TableRowBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The `vertical-align` property of the table row.
   * @default "middle"
   */
  verticalAlign?: "top" | "middle" | "bottom";
  /**
   * If `true`, the table row will have the selected styles.
   * @default false
   */
  selected?: boolean;
  /**
   * If `true`, the table row will have the hover styles on mouse-hovers.
   * @default false
   */
  hoverable?: boolean;
}

export type TableRowProps = MergeElementProps<"tr", TableRowBaseProps>;

type Component = {
  (props: TableRowProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TableRowProps> | undefined;
  displayName?: string | undefined;
};

const allowedVerticalAligns = ["top", "middle", "bottom"] as const;

const TableRowBase = (
  props: TableRowProps,
  ref: React.Ref<HTMLTableRowElement>
) => {
  const {
    className,
    children,
    verticalAlign = "middle",
    selected = false,
    hoverable = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  return (
    <tr
      ref={ref}
      className={c(
        className,
        classes.root,
        classes[camelCase(`vertical-align-${verticalAlign}`) as AlignCombo],
        { [classes.selected]: selected, [classes.hoverable]: hoverable }
      )}
      {...otherProps}
    >
      <TableRowContext.Provider value={{ isSelected: selected }}>
        {children}
      </TableRowContext.Provider>
    </tr>
  );
};

const TableRow = React.forwardRef(TableRowBase) as Component;

TableRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  selected: PropTypes.bool,
  hoverable: PropTypes.bool,
  verticalAlign: PropTypes.oneOf(allowedVerticalAligns)
};

export default TableRow;
