import clx from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import { adjustColor } from "../../styles/colorUtils";
import makeStyles from "../../styles/makeStyles";
import TableRowContext from "./context";

const componentName = "TableRow";

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const allowedVerticalAligns = ["top", "middle", "bottom"];

const useStyles = makeStyles(
  theme => {
    const { colors, darkMode } = theme;

    const selectedBgColor = !darkMode
      ? colors.primary.origin
      : colors.primary.light;

    return {
      root: {
        display: "table-row",
        outline: "none",
        color: "inherit",
        transition: "background-color 180ms ease"
      },
      verticalAlignMiddle: { verticalAlign: "middle" },
      verticalAlignTop: { verticalAlign: "top" },
      verticalAlignBottom: { verticalAlign: "bottom" },
      selected: {
        color: colors.getContrastColorOf(selectedBgColor),
        backgroundColor: selectedBgColor,
        "&$hoverable:hover": {
          backgroundColor: adjustColor(selectedBgColor, {
            saturation: -8,
            lightness: +8
          })
        }
      },
      hoverable: {
        "&:hover": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 })
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const TableRow = React.forwardRef((props, ref) => {
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
      className={clx(
        className,
        classes.root,
        classes[camelCase(`vertical-align-${verticalAlign}`)],
        { [classes.selected]: selected, [classes.hoverable]: hoverable }
      )}
      {...otherProps}
    >
      <TableRowContext.Provider value={{ isSelected: selected }}>
        {children}
      </TableRowContext.Provider>
    </tr>
  );
});

TableRow.displayName = componentName;

TableRow.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  selected: PropTypes.bool,
  hoverable: PropTypes.bool,
  verticalAlign: PropTypes.oneOf(allowedVerticalAligns)
};

export default TableRow;
