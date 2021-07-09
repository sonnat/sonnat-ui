import clx from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import makeStyles from "../../styles/makeStyles";
import TableInnerContext from "../innerContext";

const componentName = "TableFooter";

const useStyles = makeStyles(
  {
    root: { display: "table-footer-group" }
  },
  { name: `Sonnat${componentName}` }
);

const TableFooter = React.memo(
  React.forwardRef((props, ref) => {
    const { className, children, ...otherProps } = props;

    const classes = useStyles();

    return (
      <tfoot ref={ref} className={clx(className, classes.root)} {...otherProps}>
        <TableInnerContext.Provider value={{ cellVariant: "footer" }}>
          {children}
        </TableInnerContext.Provider>
      </tfoot>
    );
  })
);

TableFooter.displayName = componentName;

TableFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default TableFooter;
