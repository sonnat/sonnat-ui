import clx from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import makeStyles from "../../styles/makeStyles";
import TableInnerContext from "../innerContext";

const componentName = "TableBody";

const useStyles = makeStyles(
  {
    root: { display: "table-row-group" }
  },
  { name: `Sonnat${componentName}` }
);

const TableBody = React.forwardRef((props, ref) => {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();

  return (
    <tbody ref={ref} className={clx(className, classes.root)} {...otherProps}>
      <TableInnerContext.Provider value={{ cellVariant: "body" }}>
        {children}
      </TableInnerContext.Provider>
    </tbody>
  );
});

TableBody.displayName = componentName;

TableBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default TableBody;
