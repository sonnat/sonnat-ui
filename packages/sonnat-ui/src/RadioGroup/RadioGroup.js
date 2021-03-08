import React, { useEffect, useRef, useState, useCallback } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";
import { useForkRef, useControlled } from "../utils";
import RadioGroupContext from "./context";

const componentName = "RadioGroup";

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

const RadioGroup = React.memo(
  React.forwardRef(function RadioGroup(props, ref) {
    const {
      name,
      children,
      onChange,
      className,
      defaultValue,
      value: valueProp,
      layoutDirection = "column",
      ...otherProps
    } = props;

    const localClass = useStyles();

    const rootRef = useRef();
    const forkRef = useForkRef(ref, rootRef);

    const [isMounted, setMounted] = useState(false);

    const [value, setValue] = useControlled(
      valueProp,
      defaultValue,
      componentName
    );

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    const changeListener = useCallback(
      e => {
        if (isMounted) {
          setValue(e.target.value);
          if (onChange) onChange(e, e.target.value);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onChange, isMounted]
    );

    return (
      <RadioGroupContext.Provider
        value={{ name, value, onChange: changeListener }}
      >
        <div
          role="radiogroup"
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
      </RadioGroupContext.Provider>
    );
  })
);

RadioGroup.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  layoutDirection: PropTypes.oneOf(allowedDirections)
};

RadioGroup.displayName = componentName;

export default RadioGroup;
