import React, { useRef } from "react";
import PropTypes from "prop-types";
import clx from "classnames";
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

    const classes = useStyles();

    const rootRef = useRef();
    const forkRef = useForkRef(ref, rootRef);

    const [value, setValue] = useControlled(
      valueProp,
      defaultValue,
      componentName
    );

    const changeListener = e => {
      if (onChange) onChange(e, e.target.value);
      setValue(e.target.value);
    };

    return (
      <RadioGroupContext.Provider
        value={{ name, value, onChange: changeListener }}
      >
        <div
          role="radiogroup"
          ref={forkRef}
          className={clx(classes.root, className, {
            [classes[layoutDirection]]:
              allowedDirections.includes(layoutDirection)
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
