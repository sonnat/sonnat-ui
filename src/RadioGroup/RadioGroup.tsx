import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import { getVar, useControlledProp, useForkedRefs } from "../utils";
import RadioGroupContext from "./context";
import useStyles from "./styles";

interface RadioGroupBaseProps {
  /** The content of the group. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Value of the selected radio button. The DOM API casts this to a string.
   */
  value?: string;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: string;
  /**
   * The layout direction of the group.
   * @default "column"
   */
  layoutDirection?: "row" | "column";
  /**
   * The Callback fires when a radio button has selected.
   */
  onChange?: (selectedValue: string) => void;
}

export type RadioGroupProps = MergeElementProps<"div", RadioGroupBaseProps>;

type Component = {
  (props: RadioGroupProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<RadioGroupProps> | undefined;
  displayName?: string | undefined;
};

const allowedDirections = ["column", "row"] as const;

const RadioGroupBase = (
  props: RadioGroupProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    children,
    onChange,
    className,
    defaultValue,
    value: valueProp,
    layoutDirection: directionProp = "column",
    ...otherProps
  } = props;

  const classes = useStyles();

  const rootRef = React.useRef<HTMLDivElement>();
  const handleRef = useForkedRefs(ref, rootRef);

  const [value, setValue] = useControlledProp(valueProp, defaultValue, "");

  const layoutDirection = getVar(
    directionProp,
    "column",
    !allowedDirections.includes(directionProp)
  );

  const changeListener = (inputValue?: string) => {
    if (!inputValue) return;

    if (onChange) onChange(inputValue);
    setValue(inputValue);
  };

  return (
    <RadioGroupContext.Provider value={{ value, onChange: changeListener }}>
      <div
        role="radiogroup"
        ref={handleRef}
        className={c(classes.root, className, classes[layoutDirection])}
        {...otherProps}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

const RadioGroup = React.forwardRef(RadioGroupBase) as Component;

RadioGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,
  layoutDirection: PropTypes.oneOf(allowedDirections)
};

export default RadioGroup;
