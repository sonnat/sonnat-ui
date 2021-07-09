import clx from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import makeStyles from "../styles/makeStyles";
import TableContext from "./context";

const componentName = "Table";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      typography: { variants, pxToRem, fontFamily, fontWeight }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        width: "100%",
        overflowX: "auto",
        borderRadius: pxToRem(4)
      },
      table: {
        display: "table",
        width: "100%",
        borderCollapse: "collapse",
        borderSpacing: 0,
        captionSide: "bottom"
      },
      caption: {
        ...variants.caption,
        fontWeight: fontWeight.medium,
        textAlign: "inherit",
        padding: pxToRem(16),
        color: colors.text.secondary
      },
      dense: {
        "& $caption": {
          padding: `${pxToRem(4)} ${pxToRem(8)}`
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Table = React.memo(
  React.forwardRef((props, ref) => {
    const {
      className,
      children,
      caption,
      htmlTableProps = {},
      dense = false,
      ...otherProps
    } = props;

    const { className: htmlClassNameProp, ...otherTableProps } = htmlTableProps;

    const classes = useStyles();

    const context = React.useMemo(() => ({ isDense: dense }), [dense]);

    return (
      <div
        ref={ref}
        className={clx(className, classes.root, {
          [classes.dense]: dense
        })}
        {...otherProps}
      >
        <table
          className={clx(htmlClassNameProp, classes.table)}
          {...otherTableProps}
        >
          {caption && <caption className={classes.caption}>{caption}</caption>}
          <TableContext.Provider value={context}>
            {children}
          </TableContext.Provider>
        </table>
      </div>
    );
  })
);

Table.displayName = componentName;

Table.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  caption: PropTypes.string,
  htmlTableProps: PropTypes.object,
  dense: PropTypes.bool
};

export default Table;
