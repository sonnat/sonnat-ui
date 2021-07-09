import clx from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import makeStyles from "../../styles/makeStyles";
import TableInnerContext from "../innerContext";

const componentName = "TableHeader";

const useStyles = makeStyles(
  {
    root: { display: "table-header-group" }
  },
  { name: `Sonnat${componentName}` }
);

const TableHeader = React.memo(
  React.forwardRef((props, ref) => {
    const { className, children, ...otherProps } = props;

    const classes = useStyles();

    return (
      <thead ref={ref} className={clx(className, classes.root)} {...otherProps}>
        <TableInnerContext.Provider value={{ cellVariant: "header" }}>
          {children}
        </TableInnerContext.Provider>
      </thead>
    );
  })
);

TableHeader.displayName = componentName;

TableHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default TableHeader;
