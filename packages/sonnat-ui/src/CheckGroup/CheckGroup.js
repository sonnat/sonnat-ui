import React, { useRef } from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../styles/makeStyles";
import { useForkRef, useControlled, getVar } from "../utils";
import CheckGroupContext from "./context";

const componentName = "CheckGroup";

const allowedDirections = ["column", "row"];

const useStyles = makeStyles(
  theme => ({
    root: {
      direction: theme.direction,
      fontFamily: theme.typography.fontFamily[theme.direction],
      display: "flex",
      flexWrap: "wrap"
    },
    column: { flexDirection: "column" },
    row: { flexDirection: "row" }
  }),
  { name: `Sonnat${componentName}` }
);

const CheckGroup = React.forwardRef(function CheckGroup(props, ref) {
  const {
    name,
    children,
    onChange,
    className,
    defaultValue: defaultValueProp,
    value: valueProp,
    layoutDirection: directionProp = "column",
    ...otherProps
  } = props;

  const classes = useStyles();

  const rootRef = useRef();
  const forkRef = useForkRef(ref, rootRef);

  const { current: defaultValue } = useRef(
    valueProp != null
      ? undefined
      : defaultValueProp != null
      ? defaultValueProp
      : []
  );

  const [value, setValue] = useControlled(
    valueProp,
    defaultValue,
    componentName
  );

  if (!Array.isArray(value)) {
    throw new Error(
      `[Sonnat]: The \`value\` prop of \`CheckGroup\` component must be an array.`
    );
  }

  const layoutDirection = getVar(
    directionProp,
    "column",
    !allowedDirections.includes(directionProp)
  );

  const changeListener = e => {
    let newValue;
    const isChecked = e.target.checked;

    if (!isChecked) newValue = value.filter(v => v !== e.target.value);
    else newValue = value.concat(e.target.value);

    if (onChange) onChange(e, newValue);
    setValue(newValue);
  };

  return (
    <CheckGroupContext.Provider
      value={{ name, value, onChange: changeListener }}
    >
      <div
        role="group"
        ref={forkRef}
        className={clx(classes.root, className, {
          [classes[layoutDirection]]:
            allowedDirections.includes(layoutDirection)
        })}
        {...otherProps}
      >
        {children}
      </div>
    </CheckGroupContext.Provider>
  );
});

CheckGroup.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.arrayOf(PropTypes.string),
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  layoutDirection: PropTypes.oneOf(allowedDirections)
};

CheckGroup.displayName = componentName;

export default CheckGroup;
