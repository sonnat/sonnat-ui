import React, { useReducer, useRef } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import Icon from "../Icon";
import reducer from "./reducer";
import {
  allowAdditionAndSubtraction,
  preventAddition,
  preventSubtraction
} from "./actions";
import { clamp, useControlled, useForkRef } from "../utils";
import makeStyles from "../styles/makeStyles";

const componentName = "Stepper";
const allowedSizes = ["medium", "small"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useFontIconSize },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    return {
      root: {
        direction: "rtl",
        fontFamily: fontFamily[direction],
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        height: pxToRem(40),
        borderRadius: pxToRem(4),
        border: `${pxToRem(1)} solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.24 })
            : colors.createWhiteColor({ alpha: 0.24 })
        }`,
        transition: "border-color 360ms ease",
        "&:not($disabled):hover": {
          borderColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.48 })
            : colors.createWhiteColor({ alpha: 0.48 }),
          "& $input": { color: colors.text.primary }
        }
      },
      action: {
        width: pxToRem(40),
        height: pxToRem(40),
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        justifyItems: "center",
        flexShrink: "0",
        outline: "none",
        border: "none",
        cursor: "pointer",
        padding: "0",
        margin: "0",
        backgroundColor: colors.transparent,
        transition: "background-color 360ms ease",
        "&:hover, &:focus": {
          backgroundColor: !darkMode
            ? colors.createBlackColor({ alpha: 0.04 })
            : colors.createWhiteColor({ alpha: 0.04 }),
          "&:after, &:before": { opacity: 0 }
        },
        "&:active": {
          backgroundColor: colors.divider,
          "&:after, &:before": { opacity: 0 }
        },
        "&:after, &:before": {
          width: pxToRem(1),
          height: pxToRem(24),
          backgroundColor: colors.divider,
          opacity: "1",
          transition: "opacity 360ms ease"
        },
        "&:after": { marginRight: "auto" },
        "&:before": { marginLeft: "auto" }
      },
      addAction: {
        borderRadius: `0 ${pxToRem(4)} ${pxToRem(4)} 0`,
        "&:after": { content: '""' },
        "& $actionIcon": { marginRight: "auto" }
      },
      subtractAction: {
        borderRadius: `${pxToRem(4)} 0 0 ${pxToRem(4)}`,
        "&:before": { content: '""' },
        "& $actionIcon": { marginLeft: "auto" }
      },
      actionIcon: {
        ...useFontIconSize(20),
        color: colors.text.secondary,
        transition: "color 360ms ease"
      },
      disabledAction: {
        pointerEvents: "none",
        "& $actionIcon": { color: colors.text.disabled }
      },
      input: {
        ...useText({ color: colors.text.hint }),
        textAlign: "center",
        width: "100%",
        height: "100%",
        margin: "0",
        padding: "0",
        outline: "none",
        border: "none",
        backgroundColor: colors.transparent,
        transition: "color 360ms ease",
        "&[readonly]": { pointerEvents: "none" }
      },
      inputContainer: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "1 0",
        height: "100%",
        padding: `0 ${pxToRem(8)}`
      },
      fluid: {
        display: "flex",
        width: "100%"
      },
      disabled: {
        pointerEvents: "none",
        borderColor: colors.divider,
        "& $actionIcon": { color: colors.text.disabled }
      },
      small: {
        height: pxToRem(32),
        "& $action": {
          width: pxToRem(32),
          height: pxToRem(32),
          "&:after,&:before": { height: pxToRem(16) }
        },
        "& $actionIcon": useFontIconSize(16),
        "& $input": { fontSize: pxToRem(14) }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

// cherry-picked from
// https://stackoverflow.com/questions/42550341/react-trigger-onchange-if-input-value-is-changing-by-state/42554283#answer-59939017
const setNativeValue = (element, value) => {
  const valueSetter = Object.getOwnPropertyDescriptor(element, "value").set;
  const prototype = Object.getPrototypeOf(element);
  const prototypeValueSetter = Object.getOwnPropertyDescriptor(
    prototype,
    "value"
  ).set;

  if (!valueSetter) return;

  if (valueSetter !== prototypeValueSetter)
    prototypeValueSetter.call(element, value);
  else valueSetter.call(element, value);

  element.dispatchEvent(new Event("input", { bubbles: true }));
};

const Stepper = React.memo(
  React.forwardRef(function Stepper(props, ref) {
    const {
      className,
      onChange,
      inputProps = {},
      name: nameProp,
      value: valueProp,
      defaultValue: defaultValueProp,
      onAdd: onAddProp,
      onSubtract: onSubtractProp,
      min: minProp = 0,
      max: maxProp = Infinity,
      disabled = false,
      fluid = false,
      size = "medium",
      ...otherProps
    } = props;

    const {
      className: inputClassNameProp,
      id: inputIdProp,
      ref: inputRefProp,
      name: inputNameProp,
      onChange: inputOnChangeProp,
      ...otherInputProps
    } = inputProps;

    if (valueProp != null && isNaN(parseInt(valueProp))) {
      throw new Error(
        `[Sonnat]: Invalid \`value\` property supplied to \`${componentName}\` component. ` +
          `Expected an \`integer\` or a \`string holding an integer\`.`
      );
    } else if (defaultValueProp != null && isNaN(parseInt(defaultValueProp))) {
      throw new Error(
        `[Sonnat]: Invalid \`defaultValue\` property supplied to \`${componentName}\` component. ` +
          `Expected an \`integer\` or a \`string holding an integer\`.`
      );
    }

    if (inputNameProp != null && nameProp != null) {
      // eslint-disable-next-line no-console
      console.error(
        [
          "Sonnat: You are passing the `name` prop twice." +
            "(one as `name` property and the other one as a property of `inputProps`)",
          `We are assuming \`name="${inputNameProp}"\`!`
        ].join("\n")
      );
    }

    const localClass = useStyles();

    const name = inputNameProp || nameProp;

    const [permissions, dispatch] = useReducer(reducer, {
      addition: true,
      subtraction: true
    });

    const inputRef = useRef();
    const handleInputRef = useForkRef(inputRef, inputRefProp);

    const { current: min } = useRef(
      typeof minProp === "string" ? parseInt(minProp) : minProp
    );
    const { current: max } = useRef(
      typeof maxProp === "string" ? parseInt(maxProp) : maxProp
    );

    const { current: defaultValue } = useRef(
      valueProp != null
        ? undefined
        : clamp(defaultValueProp != null ? defaultValueProp : 0, min, max)
    );

    const [value, setValue] = useControlled(
      valueProp != null ? parseInt(valueProp) : undefined,
      parseInt(defaultValue),
      componentName
    );

    const updateActionVisibility = newValue => {
      if (parseInt(newValue) === min) dispatch(preventSubtraction());
      else if (parseInt(newValue) === max) dispatch(preventAddition());
      else dispatch(allowAdditionAndSubtraction());
    };

    const onAdd = e => {
      const newValue = clamp(parseInt(value) + 1, min, max);

      if (onAddProp) onAddProp(e, newValue);
      setValue(newValue);

      setNativeValue(inputRef.current, newValue);
    };

    const onSubtract = e => {
      const newValue = clamp(parseInt(value) - 1, min, max);

      if (onSubtractProp) onSubtractProp(e, newValue);
      setValue(newValue);

      setNativeValue(inputRef.current, newValue);
    };

    const changeHandler = e => {
      e.persist();
      if (!disabled) {
        const newValue = parseInt(e.target.value);

        if (onChange) onChange(e, newValue);
        if (inputOnChangeProp) inputOnChangeProp(e, newValue);
        setValue(newValue);
        updateActionVisibility(newValue);
      }
    };

    return (
      <div
        ref={ref}
        className={createClass(localClass.root, className, {
          [localClass[size]]: allowedSizes.includes(size),
          [localClass.disabled]: disabled,
          [localClass.fluid]: fluid
        })}
        {...otherProps}
      >
        <button
          tabIndex={!permissions.addition ? -1 : 0}
          disabled={!permissions.addition}
          className={createClass(localClass.action, localClass.addAction, {
            [localClass.disabled]: !permissions.addition
          })}
          onClick={onAdd}
        >
          <Icon identifier="plus" className={localClass.actionIcon} />
        </button>
        <div className={localClass.inputContainer}>
          <input
            name={name}
            id={inputIdProp}
            ref={handleInputRef}
            type="text"
            tabIndex={-1}
            onChange={changeHandler}
            value={value}
            readOnly
            className={createClass(localClass.input, inputClassNameProp)}
            {...otherInputProps}
          />
        </div>
        <button
          tabIndex={!permissions.subtraction ? -1 : 0}
          disabled={!permissions.subtraction}
          className={createClass(localClass.action, localClass.subtractAction, {
            [localClass.disabled]: !permissions.subtraction
          })}
          onClick={onSubtract}
        >
          <Icon identifier="minus" className={localClass.actionIcon} />
        </button>
      </div>
    );
  })
);

Stepper.displayName = componentName;

Stepper.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
  fluid: PropTypes.bool,
  onChange: PropTypes.func,
  onAdd: PropTypes.func,
  onSubtract: PropTypes.func,
  inputProps: PropTypes.object,
  size: PropTypes.oneOf(allowedSizes),
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  min: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  max: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Stepper;
