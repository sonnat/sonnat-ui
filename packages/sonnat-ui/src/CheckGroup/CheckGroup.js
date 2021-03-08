import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";
import { useForkRef, useControlled } from "../utils";
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

const CheckGroup = React.memo(
  React.forwardRef(function CheckGroup(props, ref) {
    const {
      name,
      children,
      onChange,
      className,
      defaultValue: defaultValueProp,
      value: valueProp,
      layoutDirection = "column",
      ...otherProps
    } = props;

    const localClass = useStyles();

    const rootRef = useRef();
    const forkRef = useForkRef(ref, rootRef);

    const [isMounted, setMounted] = useState(false);

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

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    const changeListener = useCallback(
      e => {
        if (isMounted) {
          const isChecked = e.target.checked;

          if (!isChecked) {
            setValue(values => {
              const newValues = values.filter(v => v !== e.target.value);
              if (onChange) onChange(e, newValues);
              return newValues;
            });
          } else {
            setValue(values => {
              const newValues = values.concat(e.target.value);
              if (onChange) onChange(e, newValues);
              return newValues;
            });
          }
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onChange, isMounted]
    );

    return (
      <CheckGroupContext.Provider
        value={{ name, value, onChange: changeListener }}
      >
        <div
          role="group"
          ref={forkRef}
          className={createClass(localClass.root, className, {
            [localClass[layoutDirection]]: allowedDirections.includes(
              layoutDirection
            )
          })}
          {...otherProps}
        >
          {children}
        </div>
      </CheckGroupContext.Provider>
    );
  })
);

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
