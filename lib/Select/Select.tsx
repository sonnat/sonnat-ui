import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import { isFragment } from "react-is";
import useFormControl from "../FormControl/useFormControl";
import InputAdornment from "../InputAdornment";
import InputBase from "../InputBase";
import { Check, ChevronDown } from "../internals/icons";
import Menu, { MenuItem, MenuItemGroup } from "../Menu";
import RemovableChip from "../RemovableChip";
import useTheme from "../styles/useTheme";
import type { MergeElementProps } from "../typings";
import {
  generateUniqueString,
  getVar,
  useControlledProp,
  useEventCallback,
  useForkedRefs,
  useId,
  useIsFocusVisible,
  useIsMounted,
  useIsomorphicLayoutEffect
} from "../utils";
import SelectContext from "./context";
import Option, { type SelectOptionProps } from "./Option";
import OptionGroup, { type SelectOptionGroupProps } from "./OptionGroup";
import useStyles from "./styles";

interface SelectBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The value of the select. Providing an empty string will Select no options.
   * Set to an empty string `''` if you don't want any of the available options to be selected.
   *
   * If the value is an object it must have reference equality with the option in order to be selected.
   * If the value is not an object, the string representation must match with the string representation of the option in order to be selected.
   */
  value?: string[] | string;
  /** The default value. Use when the component is not controlled. */
  defaultValue?: string[] | string;
  /** The helper text content. */
  helperText?: string;
  /** The helper icon element placed before the helper text. */
  helperIcon?: React.ReactNode;
  /**
   * The leading adornment for this component.
   *
   * This can be used to add a prefix, an action, or an icon to the leading of your input.
   */
  leadingAdornment?: React.ReactNode;
  /**
   * The trailing adornment for this component.
   *
   * This can be used to add a suffix, an action, or an icon to the trailing of your input.
   */
  trailingAdornment?: React.ReactNode;
  /** The `placeholder` property of the Select. */
  placeholder?: string;
  /** The `placeholder` property of the search field. */
  searchPlaceholder?: string;
  /** The empty statement text when search results are empty. */
  searchEmptyStatementText?: string;
  /**
   * If `true`, the component is shown.
   * You can only use it when the `native` prop is `false` (default).
   */
  open?: boolean;
  /**
   * If `true`, `value` must be an array and the menu will support multiple selections.
   * @default false
   */
  multiple?: boolean;
  /**
   * If `true`, the menu will be searchable.
   * @default false
   */
  searchable?: boolean;
  /**
   * If `true`, the Select will be focused.
   * @default false
   */
  focused?: boolean;
  /**
   * If `true`, the Select will be focused on mount.
   * @default false
   */
  autoFocus?: boolean;
  /**
   * If `true`, the menu will block the page's scrolling.
   * @default false
   */
  preventPageScrolling?: boolean;
  /**
   * If `true`, the Select will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the Select will be rounded.
   * @default false
   */
  rounded?: boolean;
  /**
   * If `true`, the Select will be required.
   * @default false
   */
  required?: boolean;
  /**
   * If `true`, the Select will indicate invalid input.
   * @default false
   */
  hasError?: boolean;
  /**
   * If `true`, the Select will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * The size of the Select.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The variant to use.
   * @default "outlined"
   */
  variant?: "filled" | "outlined";
  /**
   * The Callback fires when the menu has opened.
   */
  onOpen?: () => void;
  /**
   * The Callback fires when the menu has closed.
   */
  onClose?: () => void;
  /**
   * The Callback fires when the state has changed.
   */
  onChange?: (value: string[] | string) => void;
  /**
   * The Callback fires when the Select has received focus.
   */
  onFocus?: (event: React.FocusEvent<HTMLDivElement>) => void;
  /**
   * The Callback fires when the Select has lost focus.
   */
  onBlur?: (event: React.FocusEvent<HTMLDivElement>) => void;
}

export type SelectProps = Omit<
  MergeElementProps<"div", SelectBaseProps>,
  "defaultChecked"
>;

type Component = {
  (props: SelectProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<SelectProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["filled", "outlined"] as const;
const allowedSizes = ["large", "medium", "small"] as const;

const areEqual = (a: unknown, b: unknown) => {
  if (typeof b === "object" && b !== null) return a === b;
  return String(a) === String(b);
};

const isEmpty = (value: unknown) =>
  value === undefined || value === null || value === "";

const SelectBase = (props: SelectProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    id: idProp,
    className,
    onChange,
    onFocus,
    onBlur,
    onOpen,
    onClose,
    onKeyDown,
    onKeyUp,
    helperText,
    helperIcon,
    leadingAdornment,
    trailingAdornment,
    defaultValue,
    children: childrenProp,
    value: valueProp,
    placeholder: placeholderProp,
    searchPlaceholder: searchPlaceholderProp,
    searchEmptyStatementText: searchEmptyStatementTextProp,
    open: openProp,
    variant: variantProp = "outlined",
    size: sizeProp = "medium",
    multiple = false,
    searchable = false,
    autoFocus = false,
    focused = false,
    disabled = false,
    fluid = false,
    rounded = false,
    hasError = false,
    required = false,
    preventPageScrolling = false,
    ...otherProps
  } = props;

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible();

  const rootRef = React.useRef<HTMLDivElement>(null);
  const handleRef = useForkedRefs(ref, rootRef);

  const inputRef = React.useRef<HTMLDivElement>();
  const inputBaseRef = React.useRef<HTMLDivElement>(null);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const preventFocus = React.useRef(false);
  const keyboardInteractedWithChip = React.useRef(false);

  const handleInputRef = useForkedRefs(focusVisibleRef, inputRef);

  const classes = useStyles();
  const formControl = useFormControl();

  const theme = useTheme();

  const { current: isOpenControlled } = React.useRef(openProp != null);

  const [value, setValue] = useControlledProp(
    valueProp,
    defaultValue,
    multiple ? [] : ""
  );

  const isFormControlFocused = formControl ? !!formControl.focusedState : false;
  const isAutoFocus = isFormControlFocused || autoFocus || focused;
  const isRTL = theme.direction === "rtl";

  const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

  const variant = getVar(
    variantProp,
    "outlined",
    !allowedVariants.includes(variantProp)
  );

  const isMounted = useIsMounted();

  const [isOpen, setOpen] = React.useState(false);
  const [isFocused, setFocused] = React.useState(isAutoFocus);

  const placeholder =
    placeholderProp || (isRTL ? "گزینه‌ای را انتخاب کنید" : "Choose an option");

  const searchPlaceholder =
    searchPlaceholderProp || (isRTL ? "جستجو" : "Search");

  const searchEmptyStatementText =
    searchEmptyStatementTextProp ||
    (isRTL ? "هیچ موردی یافت نشد!" : "There is no such option!");

  let display: React.ReactNode | unknown[];
  let displayValue: React.ReactNode;
  const displayValues: unknown[] = [];

  let computeDisplay = false;

  const openState =
    inputRef.current !== null && (isOpenControlled ? openProp : isOpen);

  // No need to display any value if the field is empty.
  if (!isEmpty(value)) computeDisplay = true;

  if (multiple && !Array.isArray(value)) {
    throw new Error(
      "[Sonnat]: The `value` prop must be an array " +
        "when using the `Select` component with `multiple`."
    );
  }

  // inherit properties from FormControl
  const controlProps = {
    disabled: formControl ? formControl.disabled : disabled,
    hasError: formControl ? formControl.hasError : hasError,
    required: formControl ? formControl.required : required,
    fluid: formControl ? formControl.fluid : fluid,
    onFocus: (e: React.FocusEvent<HTMLDivElement>) => {
      if (isMounted() && !controlProps.disabled) {
        if (onFocus) onFocus(e);
        if (formControl && formControl.onFocus) formControl.onFocus();
      }
    },
    onBlur: (e: React.FocusEvent<HTMLDivElement>) => {
      if (isMounted() && !controlProps.disabled) {
        if (onBlur) onBlur(e);
        if (formControl && formControl.onBlur) formControl.onBlur();
      }
    },
    onChange: (newValue: string | string[]) => {
      if (isMounted() && !controlProps.disabled) {
        if (onChange) onChange(newValue);
        setValue(newValue);
      }
    }
  };

  const handleOpen = (): void => void onOpen?.();
  const handleClose = (): void => void onClose?.();
  const closeMenu = (): void => void (!isOpenControlled && setOpen(false));
  const openMenu = (): void => void (!isOpenControlled && setOpen(true));

  const removeChip = (childValue: string) => {
    const newValue = Array.isArray(value) ? value.slice() : [];

    const itemIndex = value.indexOf(childValue);
    if (itemIndex !== -1) newValue.splice(itemIndex, 1);

    if (value !== newValue) {
      setValue(newValue);
      controlProps.onChange(newValue);
    }

    closeMenu();
  };

  const keepFocus = (): void =>
    void setTimeout(() => void inputRef.current?.focus(), 200);

  const itemClickListener = (childValue: string) => {
    let newValue;

    if (multiple) {
      newValue = Array.isArray(value) ? value.slice() : [];

      if (value != null) {
        const itemIndex = value.indexOf(childValue);
        if (itemIndex === -1) newValue.push(childValue);
        else newValue.splice(itemIndex, 1);
      } else newValue.push(childValue);
    } else newValue = childValue;

    if (value !== newValue) {
      setValue(newValue);
      controlProps.onChange(newValue);
    }

    if (!multiple) {
      closeMenu();
      keepFocus();
    }
  };

  const shouldSelectChild = (childValue: string) => {
    if (value == null) return false;

    return multiple
      ? (value as string[]).some(v => areEqual(v, childValue))
      : areEqual(value, childValue);
  };

  const updateDisplay = (
    childValue: string,
    selected: boolean,
    childContent?: React.ReactNode
  ) => {
    if (selected && computeDisplay) {
      if (multiple) displayValues.push([childContent, childValue]);
      else displayValue = childContent;
    }
  };

  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) return null;

    if (isFragment(child)) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Select component doesn't accept a Fragment as a child."
      );

      return null;
    }

    if (
      (child as React.ReactElement).type !== Option &&
      (child as React.ReactElement).type !== OptionGroup
    ) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Select component only accepts `Select/OptionGroup` or `Select/Option` components."
      );

      return null;
    }

    let selected: boolean;
    const isGroup = (child as React.ReactElement).type === OptionGroup;

    if (isGroup) {
      const { children, className, title, ...otherGroupProps } = (
        child as React.ReactElement<SelectOptionGroupProps>
      ).props;

      return (
        <MenuItemGroup
          className={c(classes.optionGroup, className)}
          role="optiongroup"
          title={title}
          {...otherGroupProps}
        >
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return null;

            if (isFragment(child)) {
              // eslint-disable-next-line no-console
              console.error(
                "Sonnat: The SelectOptionGroup component doesn't accept Fragment as a child."
              );

              return null;
            }

            if ((child as React.ReactElement).type !== Option) {
              // eslint-disable-next-line no-console
              console.error(
                "Sonnat: The SelectOptionGroup component only accepts `Select/Option` component."
              );

              return null;
            }

            const {
              children,
              label,
              className,
              value,
              onClick,
              disabled,
              onMouseDown,
              ...otherOptionProps
            } = (child as React.ReactElement<SelectOptionProps>).props;

            selected = shouldSelectChild(value);
            updateDisplay(value, selected, label || children);

            return (
              <MenuItem
                aria-selected={selected ? "true" : undefined}
                className={c(classes.option, className, {
                  [classes.selected]: selected
                })}
                key={`${generateUniqueString()}/${index}`}
                disabled={disabled}
                data-value={value}
                role="option"
                onClick={e => {
                  if (onClick) onClick(e);
                  itemClickListener(value);
                }}
                onMouseDown={e => {
                  if (onMouseDown) onMouseDown(e);
                  itemClickListener(value);
                }}
                {...otherOptionProps}
              >
                {multiple && (
                  <i className={classes.optionIcon}>
                    <Check />
                  </i>
                )}
                {children}
              </MenuItem>
            );
          })}
        </MenuItemGroup>
      );
    } else {
      const {
        children,
        label,
        className,
        value,
        onClick,
        disabled,
        onMouseDown,
        ...otherOptionProps
      } = (child as React.ReactElement<SelectOptionProps>).props;

      selected = shouldSelectChild(value);
      updateDisplay(value, selected, label || children);

      return (
        <MenuItem
          aria-selected={selected ? "true" : undefined}
          className={c(classes.option, className, {
            [classes.selected]: selected
          })}
          disabled={disabled}
          data-value={value}
          role="option"
          onClick={e => {
            if (onClick) onClick(e);
            itemClickListener(value);
          }}
          onMouseDown={e => {
            if (onMouseDown) onMouseDown(e);
            itemClickListener(value);
          }}
          {...otherOptionProps}
        >
          {multiple && (
            <i className={classes.optionIcon}>
              <Check />
            </i>
          )}
          {children}
        </MenuItem>
      );
    }
  });

  if (computeDisplay) display = multiple ? displayValues : displayValue;

  const [isFocusVisible, setFocusVisible] = React.useState(false);

  // prevent component from being focused if it is disabled
  React.useEffect(() => {
    if (controlProps.disabled && isFocused) {
      setFocused(false);
      setFocusVisible(false);
    }
  }, [controlProps.disabled, isFocused]);

  React.useEffect(() => {
    isFocusVisibleRef.current = isFocusVisible;
    // isFocusVisibleRef.current = isFocused;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocusVisible]);

  React.useEffect(() => {
    if (!preventFocus.current) setFocused(isFocusVisible);
  }, [isFocusVisible]);

  // initially focus the component
  useIsomorphicLayoutEffect(() => {
    if (!controlProps.disabled) {
      if (isAutoFocus && inputRef.current) {
        inputRef.current.focus();
      }
    }
  }, []);

  const handleFocus = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!inputRef.current) inputRef.current = event.currentTarget;

      handleFocusVisible(event);

      if (isFocusVisibleRef.current === true) {
        // setFocused(true);
        setFocusVisible(true);
      }
      controlProps.onFocus(event);
    }
  );

  const handleBlur = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      handleBlurVisible(event);

      if (isFocusVisibleRef.current === false) {
        // setFocused(false);
        setFocusVisible(false);
      }
      controlProps.onBlur(event);
    }
  );

  const keyDownRef = React.useRef(false);

  const handleKeyDown = useEventCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (keyDownRef.current === false && isFocused && event.key === " ")
        keyDownRef.current = true;

      if (event.target === event.currentTarget && event.key === " ")
        event.preventDefault();

      if (onKeyDown) onKeyDown(event);

      if (
        !disabled &&
        isFocused &&
        event.target === event.currentTarget &&
        (event.key === "Down" || event.key === "ArrowDown")
      ) {
        inputRef.current?.blur();
      }
    }
  );

  const handleKeyUp = useEventCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (!event.defaultPrevented && isFocused && event.key === " ")
        keyDownRef.current = false;

      if (onKeyUp) onKeyUp(event);

      if (
        !event.defaultPrevented &&
        isFocused &&
        event.target === event.currentTarget &&
        event.key === " "
      ) {
        if (openState) closeMenu();
        else openMenu();
      }
    }
  );

  const id = useId(idProp, "SELECT-CONTROLLER");

  const createInputController = () => {
    return (
      <div
        aria-haspopup="listbox"
        aria-disabled={controlProps.disabled}
        tabIndex={controlProps.disabled ? -1 : 0}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyUp={handleKeyUp}
        onKeyDown={handleKeyDown}
        id={id}
        className={c(classes.input, { [classes.focusVisible]: isFocusVisible })}
        ref={handleInputRef}
      >
        <div className={classes.display}>
          {!display || (display as unknown[]).length === 0 ? (
            <span className={classes.placeholder}>{placeholder}</span>
          ) : multiple ? (
            <div className={classes.displayMultiple}>
              {Array.isArray(display) &&
                display.map((item, index) => {
                  const [content, value] = item as [React.ReactNode, string];

                  const isContentArray =
                    typeof content !== "string" &&
                    typeof content === "object" &&
                    Array.isArray(content);

                  return (
                    <RemovableChip
                      disabled={disabled}
                      size={size}
                      className={classes.chip}
                      onRemove={() => {
                        removeChip(value);

                        if (keyboardInteractedWithChip.current) {
                          preventFocus.current = false;
                          keyboardInteractedWithChip.current = false;

                          inputRef.current?.focus();
                          setFocused(true);
                        }
                      }}
                      onKeyUp={e => {
                        if (e.key === " ")
                          keyboardInteractedWithChip.current = true;
                      }}
                      onKeyDown={e => {
                        if (e.key.toLowerCase() === "enter") {
                          keyboardInteractedWithChip.current = true;
                        }
                      }}
                      onFocus={() => {
                        setFocused(false);
                        preventFocus.current = true;
                      }}
                      onBlur={() => {
                        preventFocus.current = false;
                      }}
                      label={
                        (isContentArray
                          ? (content as unknown[]).join("")
                          : content) as string
                      }
                      key={`${generateUniqueString()}/${index}`}
                    />
                  );
                })}
            </div>
          ) : (
            <span className={classes.displaySingle}>{display}</span>
          )}
        </div>
      </div>
    );
  };

  const detectOutsideClicks = (e: MouseEvent) =>
    menuRef.current !== null &&
    menuRef.current !== e.target &&
    !inputRef.current?.contains(e.target as HTMLElement) &&
    !menuRef.current?.contains(e.target as HTMLElement) &&
    !rootRef.current?.contains(e.target as HTMLElement);

  const outsideClickHandler = useEventCallback(() => void closeMenu());

  const handleEscapeKeyDown = useEventCallback(() => {
    closeMenu();
    keepFocus();
  });

  return (
    <div
      ref={handleRef}
      role="button"
      className={c(classes.root, className, classes[size], {
        [classes.fluid]: controlProps.fluid
      })}
      {...otherProps}
    >
      <SelectContext.Provider value={{ isMultiple: multiple }}>
        <InputBase
          ref={inputBaseRef}
          focused={isFocused}
          rounded={rounded}
          hasError={controlProps.hasError}
          disabled={controlProps.disabled}
          fluid={controlProps.fluid}
          size={size}
          variant={variant}
          leadingAdornment={leadingAdornment}
          trailingAdornment={
            <InputAdornment>
              {trailingAdornment}
              <InputAdornment variant="icon" className={classes.caretIcon}>
                <ChevronDown />
              </InputAdornment>
            </InputAdornment>
          }
          onMouseDown={e => {
            if (!controlProps.disabled) {
              const chipSelector = `.${classes.chip}`;
              if (
                !(e.target as HTMLElement).closest(chipSelector) &&
                !menuRef.current?.contains(e.target as HTMLElement)
              ) {
                if (openState) closeMenu();
                else openMenu();
              }
            }
          }}
          className={c(classes.base, {
            [classes.open]: openState,
            [classes.disabled]: controlProps.disabled,
            [classes.errored]: controlProps.hasError
          })}
          controller={createInputController()}
        />

        {!!helperText && (
          <div className={classes.helperRow}>
            <p className={classes.helperContent}>
              {helperIcon && <i className={classes.helperIcon}>{helperIcon}</i>}
              <span className={classes.helperText}>{helperText}</span>
            </p>
          </div>
        )}
        <Menu
          role="listbox"
          anchorNode={inputBaseRef.current}
          ref={menuRef}
          className={classes.menu}
          preventPageScrolling={preventPageScrolling}
          onOutsideClick={outsideClickHandler}
          outsideClickDetector={detectOutsideClicks}
          searchable={searchable}
          searchPlaceholder={searchPlaceholder}
          searchEmptyStatementText={searchEmptyStatementText}
          onEscapeKeyDown={handleEscapeKeyDown}
          dense={size !== "large"}
          onOpen={handleOpen}
          onClose={handleClose}
          open={openState}
        >
          {children}
        </Menu>
      </SelectContext.Provider>
    </div>
  );
};

const Select = React.forwardRef(SelectBase) as Component;

Select.propTypes = {
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  children: PropTypes.node,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  helperText: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  searchEmptyStatementText: PropTypes.string,
  helperIcon: PropTypes.node,
  leadingAdornment: PropTypes.node,
  trailingAdornment: PropTypes.node,
  preventPageScrolling: PropTypes.bool,
  open: PropTypes.bool,
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  focused: PropTypes.bool,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  rounded: PropTypes.bool,
  hasError: PropTypes.bool,
  required: PropTypes.bool,
  fluid: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onKeyDown: PropTypes.func,
  onKeyUp: PropTypes.func,
  size: PropTypes.oneOf(allowedSizes),
  variant: PropTypes.oneOf(allowedVariants)
};

export default Select;
