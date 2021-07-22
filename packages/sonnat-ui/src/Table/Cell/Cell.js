import clx from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import makeStyles from "../../styles/makeStyles";
import TableContext from "../context";
import TableInnerContext from "../innerContext";
import TableRowContext from "../Row/context";

const allowedTextAligns = ["inherit", "center", "justify", "left", "right"];

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const componentName = "TableCell";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      typography: { pxToRem, variants }
    } = theme;

    return {
      root: {
        display: "table-cell",
        verticalAlign: "inherit",
        borderBottom: `1px solid ${colors.divider}`,
        padding: pxToRem(16)
      },
      bodyCell: {
        ...variants.body,
        color: colors.text.primary
      },
      headerCell: {
        ...variants.subtitle,
        color: colors.text.primary,
        borderBottomColor: darkMode
          ? "rgba(255, 255, 255, 0.24)"
          : "rgba(0, 0, 0, 0.24)"
      },
      footerCell: {
        ...variants.caption,
        color: colors.text.secondary
      },
      textAlignCenter: { textAlign: "center" },
      textAlignInherit: { textAlign: "inherit" },
      textAlignJustify: { textAlign: "justify" },
      textAlignLeft: { textAlign: "left" },
      textAlignRight: { textAlign: "right" },
      dense: { padding: pxToRem(8) },
      selected: { color: "inherit" }
    };
  },
  { name: `Sonnat${componentName}` }
);

const TableCell = React.memo(
  React.forwardRef((props, ref) => {
    const { className, children, textAlign = "inherit", ...otherProps } = props;

    const { cellVariant } = React.useContext(TableInnerContext);
    const { isDense } = React.useContext(TableContext);
    const { isSelected } = React.useContext(TableRowContext);

    const classes = useStyles();

    const Node = cellVariant === "header" ? "th" : "td";

    return (
      <Node
        ref={ref}
        className={clx(
          className,
          classes.root,
          classes[`${cellVariant}Cell`],
          classes[camelCase(`text-align-${textAlign}`)],
          { [classes.dense]: isDense, [classes.selected]: isSelected }
        )}
        {...otherProps}
      >
        {children}
      </Node>
    );
  })
);

TableCell.displayName = componentName;

TableCell.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  textAlign: PropTypes.oneOf(allowedTextAligns)
};

export default TableCell;
