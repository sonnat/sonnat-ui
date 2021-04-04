import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle
} from "react";
import { isFragment } from "react-is";
import PropTypes from "prop-types";
import createClass from "classnames";
import useFormControl from "../FormControl/useFormControl";
import InputBase from "../InputBase";
import InputAdornment from "../InputAdornment";
import Icon from "../Icon";
import Menu, { MenuItem, MenuItemGroup } from "../Menu";
import RemovableChip from "../RemovableChip";
import { componentName as optionName } from "./Option";
import { componentName as optionGroupName } from "./OptionGroup";
import { makeStyles, useTheme } from "../styles";
import {
  setRef,
  useControlled,
  useEnhancedEffect,
  generateUniqueString,
  useForkRef,
  closest
} from "../utils";

const componentName = "Select";
const allowedVariants = ["filled", "outlined"];
const allowedSizes = ["medium", "small"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "inline-flex",
        position: "relative",
        flexDirection: "column"
      },
      base: { cursor: "pointer" },
      input: {
        ...useText({ color: colors.text.primary }),
        border: "none",
        outline: "none",
        padding: 0,
        margin: 0,
        flex: [[1, 1]],
        minWidth: 0,
        height: "100%",
        appearance: "none !important",
        backgroundColor: colors.transparent
      },
      helperRow: {
        display: "flex",
        marginTop: pxToRem(4),
        padding: [[0, pxToRem(8)]]
      },
      helperContent: {
        display: "flex",
        margin: 0,
        flex: [[1, 0]]
      },
      helperText: {
        ...useText({
          fontSize: pxToRem(12),
          color: colors.text.secondary
        })
      },
      helperIconWrapper: {
        paddingTop: pxToRem(4),
        ...(direction === "rtl"
          ? { paddingLeft: pxToRem(4) }
          : { paddingRight: pxToRem(4) })
      },
      helperIcon: {
        color: colors.text.secondary,
        width: pxToRem(16),
        height: pxToRem(16),
        maxWidth: pxToRem(16),
        maxHeight: pxToRem(16),
        fontSize: pxToRem(16)
      },
      placeholder: {
        ...useText({ fontSize: pxToRem(16), color: colors.text.hint }),
        flexGrow: "1",
        overflow: "hidden",
        alignSelf: "center",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      },
      display: { display: "flex", height: "100%" },
      displaySingle: {
        extend: "placeholder",
        color: colors.text.primary
      },
      displayMultiple: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap"
      },
      chip: {
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(4) }
          : { marginRight: pxToRem(4) }),
        marginBottom: pxToRem(2),
        marginTop: pxToRem(2)
      },
      menu: {},
      option: {},
      optionGroup: {},
      optionIcon: {},
      caretIcon: {},
      selected: {
        color: !darkMode ? colors.primary.origin : colors.primary.light
      },
      disabled: {
        pointerEvents: "none",
        "& $placeholder, & $displaySingle": { color: colors.text.disabled }
      },
      open: {
        "& $caretIcon": {
          transform: "rotate(180deg)"
        }
      },
      small: {
        "& $placeholder, & $displaySingle": { fontSize: pxToRem(12) }
      },
      fluid: { width: "100%" },
      medium: {},
      errored: {
        "&:not($disabled)": {
          "& $helperText": {
            color: !darkMode ? colors.error.origin : colors.error.light
          },
          "& $helperIcon": {
            color: !darkMode ? colors.error.origin : colors.error.light
          }
        }
      },
      native: {}
    };
  },
  { name: `Sonnat${componentName}` }
);

const createHelperIcon = (helperIcon, className) =>
  React.cloneElement(helperIcon, {
    className: createClass(className, helperIcon.props.className)
  });

const areEqual = (a, b) => {
  if (typeof b === "object" && b !== null) {
    return a === b;
  }

  return String(a) === String(b);
};

const isEmpty = value => value === undefined || value === null || value === "";

const Select = React.memo(
  React.forwardRef(function Select(props, refProp) {
    const {
      className,
      onChange,
      onFocus,
      onBlur,
      onOpen,
      onClose,
      helperText,
      helperIcon,
      leadingAdornment,
      trailingAdornment,
      inputProps = {},
      defaultValue: defaultValueProp,
      children: childrenProp,
      value: valueProp,
      name: nameProp,
      placeholder: placeholderProp,
      searchPlaceholder: searchPlaceholderProp,
      searchEmptyStatementText: searchEmptyStatementTextProp,
      open: openProp,
      variant = "outlined",
      size = "medium",
      multiple = false,
      searchable = false,
      autoFocus = false,
      native = false,
      focused = false,
      disabled = false,
      fluid = false,
      rounded = false,
      hasError = false,
      required = false,
      preventPageScrolling = true,
      ...otherProps
    } = props;

    const {
      className: inputClassNameProp,
      id: inputIdProp,
      ref: inputRefProp,
      name: inputNameProp,
      onFocus: inputOnFocusProp,
      onBlur: inputOnBlurProp,
      onChange: inputOnChangeProp,
      autoFocus: inputAutoFocusProp = false,
      ...otherInputProps
    } = inputProps;

    const inputRef = useRef();
    const inputBaseRef = useRef();
    const menuRef = useRef();
    const rootRef = useRef();

    const ref = useForkRef(rootRef, refProp);

    const localClass = useStyles();
    const formControl = useFormControl();

    const theme = useTheme();

    const { current: isOpenControlled } = useRef(openProp != null);
    const { current: defaultValue } = useRef(
      defaultValueProp ? defaultValueProp : multiple ? [] : ""
    );

    const [value, setValue, isControlled] = useControlled(
      valueProp,
      defaultValue,
      componentName
    );

    const isInit = useRef(true);

    const name = inputNameProp || nameProp;

    const isAutoFocus = !!inputAutoFocusProp || autoFocus || focused;
    const isRTL = theme.direction === "rtl";

    const [isOpen, setOpen] = useState(false);
    const [isMounted, setMounted] = useState(false);
    const [isFocused, setFocused] = useState(isAutoFocus);

    const placeholder =
      placeholderProp ||
      (isRTL ? "گزینه‌ای را انتخاب کنید" : "Choose an option");

    const searchPlaceholder =
      searchPlaceholderProp || (isRTL ? "جستجو" : "Search");

    const searchEmptyStatementText =
      searchEmptyStatementTextProp ||
      (isRTL ? "هیچ موردی یافت نشد!" : "There is no such option!");

    let display;
    let displayValue;
    const displayValues = [];

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
      size: formControl ? formControl.size : size,
      focused: formControl ? formControl.focusedState : isFocused,
      disabled: formControl ? formControl.disabled : disabled,
      hasError: formControl ? formControl.hasError : hasError,
      required: formControl ? formControl.required : required,
      fluid: formControl ? formControl.fluid : fluid,
      onFocus: e => {
        if (isMounted) {
          if (e.persist) e.persist();
          if (!controlProps.disabled) {
            if (onFocus) onFocus(e);
            if (inputOnFocusProp) inputOnFocusProp(e);
            if (formControl && formControl.onFocus) formControl.onFocus(e);
            else setFocused(true);
          }
        }
      },
      onBlur: e => {
        if (isMounted) {
          if (!controlProps.disabled) {
            if (e.persist) e.persist();
            if (onBlur) onBlur(e);
            if (inputOnBlurProp) inputOnBlurProp(e);
            if (formControl && formControl.onBlur) formControl.onBlur(e);
            else setFocused(false);
          }
        }
      },
      onChange: (e, v) => {
        if (isMounted) {
          if (!controlProps.disabled) {
            const newValue = v != null ? v : e != null ? e.target.value : null;

            if (e.persist) e.persist();
            if (onChange) onChange(e, newValue);
            if (inputOnChangeProp) inputOnChangeProp(e, newValue);
            setValue(newValue);
          }
        }
      }
    };

    // prevent component from being focused if it is disabled
    controlProps.focused = controlProps.disabled ? false : controlProps.focused;

    const updateOpenState = newOpenState => {
      if (newOpenState) {
        if (onOpen) onOpen();
        setFocused(true);
      } else {
        if (onClose) onClose();
        setFocused(false);
      }

      if (!isOpenControlled) setOpen(newOpenState);
    };

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    // initially focus the component if it is focused
    useEnhancedEffect(() => {
      if (isInit.current && isMounted && !controlProps.disabled) {
        if (isAutoFocus || controlProps.focused) {
          if (inputRef.current) {
            updateOpenState(true);
            isInit.current = false;
          }
        }
      }
    }, [isMounted]);

    const removeChip = (e, childValue) => {
      let newValue = Array.isArray(value) ? value.slice() : [];

      const itemIndex = value.indexOf(childValue);
      if (itemIndex !== -1) newValue.splice(itemIndex, 1);

      if (value !== newValue) {
        setValue(newValue);
        controlProps.onChange(e, newValue);
      }

      updateOpenState(false);
    };

    const itemClickListener = (e, childValue) => {
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
        controlProps.onChange(e, newValue);
      }

      if (!multiple) updateOpenState(false);
    };

    const shouldSelectChild = childValue => {
      if (value == null) return false;

      return multiple
        ? value.some(v => areEqual(v, childValue))
        : areEqual(value, childValue);
    };

    const updateDisplay = (childContent, childValue, selected) => {
      if (selected && computeDisplay) {
        if (multiple) displayValues.push([childContent, childValue]);
        else displayValue = childContent;
      }
    };

    useImperativeHandle(refProp, () => ({
      focus: () => {
        if (!controlProps.disabled) {
          if (native) inputRef.current.focus();
          else updateOpenState(true);
        }
      },
      blur: () => {
        if (!controlProps.disabled) {
          if (native) inputRef.current.blur();
          else updateOpenState(false);
        }
      },
      clear: () => {
        const newValue = multiple ? [] : "";

        if (value !== newValue) {
          setValue(newValue);
          controlProps.onChange(undefined, newValue);
        }

        updateOpenState(false);
      }
    }));

    const children = React.Children.map(childrenProp, child => {
      if (!React.isValidElement(child)) return null;

      if (isFragment(child)) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The Select component doesn't accept a Fragment as a child."
        );

        return null;
      }

      if (![optionGroupName, optionName].includes(child.type.displayName)) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The Select component only accepts `Select/OptionGroup` or `Select/Option` components."
        );

        return null;
      }

      let selected;
      const isGroup = child.type.displayName === optionGroupName;

      if (isGroup) {
        const { children, className, title, ...otherGroupProps } = child.props;

        return (
          <MenuItemGroup
            ref={child.ref}
            className={createClass(localClass.optionGroup, className)}
            role="optiongroup"
            title={title}
            {...otherGroupProps}
          >
            {children.map((child, index) => {
              const {
                children,
                label,
                className,
                value,
                onClick,
                onFocus,
                onBlur,
                disabled,
                ...otherOptionProps
              } = child.props;

              selected = shouldSelectChild(value);
              updateDisplay(label || children, value, selected);

              return (
                <MenuItem
                  aria-selected={selected ? "true" : undefined}
                  className={createClass(localClass.option, className, {
                    [localClass.selected]: selected
                  })}
                  key={`${generateUniqueString()}/${index}`}
                  disabled={disabled}
                  data-value={value}
                  role="option"
                  onClick={e => {
                    if (onClick) onClick(e);
                    itemClickListener(e, value);
                  }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  {...otherOptionProps}
                >
                  {multiple && (
                    <Icon
                      identifier="check"
                      className={localClass.optionIcon}
                    />
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
          onFocus,
          onBlur,
          disabled,
          ...otherOptionProps
        } = child.props;

        selected = shouldSelectChild(value);
        updateDisplay(label || children, value, selected);

        return (
          <MenuItem
            aria-selected={selected ? "true" : undefined}
            className={createClass(localClass.option, className, {
              [localClass.selected]: selected
            })}
            disabled={disabled}
            data-value={value}
            role="option"
            onClick={e => {
              if (onClick) onClick(e);
              itemClickListener(e, value);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            {...otherOptionProps}
          >
            {multiple && (
              <Icon identifier="check" className={localClass.optionIcon} />
            )}
            {children}
          </MenuItem>
        );
      }
    });

    if (computeDisplay) display = multiple ? displayValues : displayValue;

    const InputComponent = native ? "select" : "div";

    const createInputController = () => {
      let inputProps;

      if (native) {
        inputProps = {
          value: isControlled ? value : undefined,
          defaultValue: !isControlled ? defaultValue : undefined,
          name: name,
          required: controlProps.required,
          disabled: controlProps.disabled,
          onFocus: controlProps.onFocus,
          onBlur: controlProps.onBlur,
          onChange: e => controlProps.onChange(e, undefined),
          tabIndex: controlProps.disabled ? "-1" : "0"
        };
      } else
        inputProps = {
          tabIndex: controlProps.disabled ? "-1" : "0",
          role: "button",
          "aria-haspopup": "listbox",
          "aria-disabled": controlProps.disabled,
          ...otherInputProps
        };

      return (
        <InputComponent
          id={
            inputIdProp || name
              ? `sonnat-select-input-component-${name}`
              : undefined
          }
          className={createClass(localClass.input, inputClassNameProp, {
            [localClass.native]: native
          })}
          ref={node => {
            if (inputRefProp) setRef(inputRefProp, node);
            setRef(inputRef, node);
          }}
          {...inputProps}
        >
          <div className={localClass.display}>
            {!display || display.length === 0 ? (
              <span className={localClass.placeholder}>{placeholder}</span>
            ) : multiple ? (
              <div className={localClass.displayMultiple}>
                {display.map((item, index) => {
                  const [content, value] = item;

                  return (
                    <RemovableChip
                      disabled={disabled}
                      size={size}
                      className={localClass.chip}
                      onRemove={e => removeChip(e, value)}
                      label={content}
                      key={`${generateUniqueString}/${index}`}
                    />
                  );
                })}
              </div>
            ) : (
              <span className={localClass.displaySingle}>{display}</span>
            )}
          </div>
        </InputComponent>
      );
    };

    const detectOutsideClicks = e =>
      menuRef.current !== null &&
      menuRef.current !== e.target &&
      !inputRef.current.contains(e.target) &&
      !menuRef.current.contains(e.target) &&
      !rootRef.current.contains(e.target);

    const outsideClickHandler = useCallback(
      () => {
        updateOpenState(false);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    return (
      <div
        ref={ref}
        className={createClass(localClass.root, {
          [localClass.fluid]: fluid,
          [localClass[controlProps.size]]: allowedSizes.includes(
            controlProps.size
          )
        })}
        onMouseDown={e => {
          if (!controlProps.disabled) {
            const chipSelector = `.${localClass.chip}`;
            if (
              !closest(e.target, chipSelector) &&
              !menuRef.current.contains(e.target)
            )
              updateOpenState(!openState);
          }
        }}
        {...otherProps}
      >
        <InputBase
          ref={inputBaseRef}
          focused={controlProps.focused}
          rounded={rounded}
          hasError={controlProps.hasError}
          disabled={controlProps.disabled}
          fluid={controlProps.fluid}
          size={controlProps.size}
          variant={variant}
          leadingAdornment={leadingAdornment}
          trailingAdornment={
            <InputAdornment>
              {trailingAdornment}
              <InputAdornment variant="icon">
                <Icon
                  className={localClass.caretIcon}
                  aria-hidden="true"
                  identifier="chevron-down"
                  color="inherit"
                />
              </InputAdornment>
            </InputAdornment>
          }
          className={createClass(localClass.base, className, {
            [localClass.open]: openState,
            [localClass.disabled]: controlProps.disabled,
            [localClass.errored]: controlProps.hasError
          })}
          controller={createInputController()}
          controllerId={
            inputIdProp || name
              ? `sonnat-select-input-component-${name}`
              : undefined
          }
        />
        {(!!helperText || !!otherInputProps.maxLength) && (
          <div className={localClass.helperRow}>
            {helperText && (
              <p className={localClass.helperContent}>
                {helperIcon && (
                  <span className={localClass.helperIconWrapper}>
                    {createHelperIcon(helperIcon, localClass.helperIcon)}
                  </span>
                )}
                <span className={localClass.helperText}>{helperText}</span>
              </p>
            )}
          </div>
        )}
        {native ? null : (
          <Menu
            role="listbox"
            anchorNode={inputBaseRef.current}
            ref={menuRef}
            className={localClass.menu}
            preventPageScrolling={preventPageScrolling}
            onOutsideClick={outsideClickHandler}
            outsideClickDetector={detectOutsideClicks}
            searchable={searchable}
            searchPlaceholder={searchPlaceholder}
            searchEmptyStatementText={searchEmptyStatementText}
            dense={size === "small"}
            onOpen={onOpen}
            onClose={onClose}
            open={openState}
          >
            {children}
          </Menu>
        )}
      </div>
    );
  })
);

Select.propTypes = {
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  children: PropTypes.node,
  name: PropTypes.string,
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
  native: PropTypes.bool,
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
  inputProps: PropTypes.object,
  size: PropTypes.oneOf(allowedSizes),
  variant: PropTypes.oneOf(allowedVariants)
};

Select.displayName = componentName;

export default Select;
