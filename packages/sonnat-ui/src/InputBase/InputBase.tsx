import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import SelectContext from "../Select/context";
import TextFieldContext from "../TextField/context";
import type { MergeElementProps } from "../typings";
import getVar from "../utils/getVar";
import InputBaseContext from "./context";
import useStyles from "./styles";

interface InputBaseBProps {
  /** The content of the component */
  children?: React.ReactNode;
  /** The controller component */
  controller?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Leading adornment for this component.
   *
   * This can be used to add a prefix, a suffix or an action to the leading of your input.
   */
  leadingAdornment: React.ReactNode;
  /**
   * Leading adornment for this component.
   *
   * This can be used to add a prefix, a suffix or an action to the trailing of your input.
   */
  trailingAdornment: React.ReactNode;
  /**
   * If `true`, the component will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the component will be readOnly.
   * @default false
   */
  readOnly?: boolean;
  /**
   * If `true`, the component will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * If `true`, the component will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the component will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the component will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * The size of the component.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The variant of the component.
   * @default "outlined"
   */
  variant?: "filled" | "outlined";
}

export type InputBaseProps = MergeElementProps<"div", InputBaseBProps>;

type Component = {
  (props: InputBaseProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<InputBaseProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["filled", "outlined"] as const;
const allowedSizes = ["large", "medium", "small"] as const;

const InputBaseBase = (
  props: InputBaseProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    children,
    controller,
    className,
    leadingAdornment,
    trailingAdornment,
    variant: variantProp = "outlined",
    size: sizeProp = "medium",
    focused = false,
    readOnly = false,
    disabled = false,
    fluid = false,
    rounded = false,
    hasError = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  const textFieldContext = React.useContext(TextFieldContext);
  const selectContext = React.useContext(SelectContext);

  const hasLeadingAdornment = !!leadingAdornment;
  const hasTrailingAdornment = !!trailingAdornment;

  const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

  const variant = getVar(
    variantProp,
    "outlined",
    !allowedVariants.includes(variantProp)
  );

  return (
    <InputBaseContext.Provider value={{ size, disabled, hasError }}>
      <div
        ref={ref}
        className={c(className, classes.root, classes[size], classes[variant], {
          [classes.empty]: textFieldContext?.isEmpty,
          [classes.multipleSelect]: selectContext?.isMultiple,
          [classes.fluid]: fluid,
          [classes.disabled]: disabled,
          [classes.readOnly]: readOnly,
          [classes.focused]: focused,
          [classes.withLeadingAdornment]: hasLeadingAdornment,
          [classes.withTrailingAdornment]: hasTrailingAdornment,
          [classes.rounded]: rounded,
          [classes.errored]: hasError
        })}
        {...otherProps}
      >
        <div className={classes.wrapper}>
          {leadingAdornment && (
            <div className={classes.leadingAdornment}>{leadingAdornment}</div>
          )}
          <div className={classes.control}>{controller}</div>
          {trailingAdornment && (
            <div className={classes.trailingAdornment}>{trailingAdornment}</div>
          )}
          <div aria-hidden={true} className={classes.notchedOutline} />
        </div>
      </div>
      {children}
    </InputBaseContext.Provider>
  );
};

const InputBase = React.forwardRef(InputBaseBase) as Component;

InputBase.propTypes = {
  children: PropTypes.node,
  controller: PropTypes.node,
  className: PropTypes.string,
  leadingAdornment: PropTypes.node,
  trailingAdornment: PropTypes.node,
  focused: PropTypes.bool,
  readOnly: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  hasError: PropTypes.bool,
  fluid: PropTypes.bool,
  size: PropTypes.oneOf(allowedSizes),
  variant: PropTypes.oneOf(allowedVariants)
};

export default InputBase;
