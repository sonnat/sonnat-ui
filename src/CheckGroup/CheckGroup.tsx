import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import { getVar, useControlledProp, useForkedRefs } from "../utils";
import CheckGroupContext from "./context";
import useStyles from "./styles";

interface CheckGroupBaseProps {
  /** The content of the group. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The values of the selected checkboxes. */
  value?: string[];
  /** The default value. Use when the component is not controlled. */
  defaultValue?: string[];
  /**
   * The layout direction of the group.
   * @default "column"
   */
  layoutDirection?: "row" | "column";
  /**
   * The Callback fires when a checkbox has selected.
   */
  onChange?: (selectedValues: string[]) => void;
}

export type CheckGroupProps = MergeElementProps<"div", CheckGroupBaseProps>;

type Component = {
  (props: CheckGroupProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<CheckGroupProps> | undefined;
  displayName?: string | undefined;
};

const allowedDirections = ["column", "row"] as const;

const CheckGroupBase = (
  props: CheckGroupProps,
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

  const [value, setValue] = useControlledProp(valueProp, defaultValue, []);

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

  const changeListener = (isChecked: boolean, inputValue?: string) => {
    let newValue;

    if (!inputValue) return;

    if (!isChecked) newValue = value.filter(v => v !== inputValue);
    else newValue = value.concat(inputValue);

    if (onChange) onChange(newValue);
    setValue(newValue);
  };

  return (
    <CheckGroupContext.Provider value={{ value, onChange: changeListener }}>
      <div
        role="group"
        ref={handleRef}
        className={c(classes.root, className, classes[layoutDirection])}
        {...otherProps}
      >
        {children}
      </div>
    </CheckGroupContext.Provider>
  );
};

const CheckGroup = React.forwardRef(CheckGroupBase) as Component;

CheckGroup.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  value: PropTypes.arrayOf(PropTypes.string),
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  defaultValue: PropTypes.arrayOf(PropTypes.string),
  onChange: PropTypes.func,
  layoutDirection: PropTypes.oneOf(allowedDirections)
};

export default CheckGroup;
