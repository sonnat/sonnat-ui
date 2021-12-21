import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import TableContext from "./context";
import useStyles from "./styles";

interface TableBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** Set the content of the `<caption>` element. */
  caption?: string;
  /** The properties applied to the `table` element. */
  htmlTableProps?: React.ComponentPropsWithoutRef<"table">;
  /**
   * If `true`, the table will appear denser.
   * @default false
   */
  dense?: boolean;
  /**
   * If `true`, the table will be border-less.
   * @default false
   */
  borderLess?: boolean;
}

export type TableProps = MergeElementProps<"div", TableBaseProps>;

type Component = {
  (props: TableProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TableProps> | undefined;
  displayName?: string | undefined;
};

const TableBase = (props: TableProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className,
    children,
    caption,
    htmlTableProps = {},
    dense = false,
    borderLess = false,
    ...otherProps
  } = props;

  const { className: htmlClassNameProp, ...otherTableProps } = htmlTableProps;

  const classes = useStyles();

  const context = React.useMemo(() => ({ isDense: dense }), [dense]);

  return (
    <div
      ref={ref}
      className={c(className, classes.root, {
        [classes.dense]: dense,
        [classes.borderLess]: borderLess
      })}
      {...otherProps}
    >
      <table
        className={c(htmlClassNameProp, classes.table)}
        {...otherTableProps}
      >
        {caption && <caption className={classes.caption}>{caption}</caption>}
        <TableContext.Provider value={context}>
          {children}
        </TableContext.Provider>
      </table>
    </div>
  );
};

const Table = React.forwardRef(TableBase) as Component;

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  caption: PropTypes.string,
  htmlTableProps: PropTypes.object,
  dense: PropTypes.bool,
  borderLess: PropTypes.bool
};

export default Table;
