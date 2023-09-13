import c from "classnames";
import throttle from "lodash.throttle";
import PropTypes from "prop-types";
import * as React from "react";
import { isFragment } from "react-is";
import InputAdornment from "../InputAdornment";
import Magnifier from "../internals/icons/Magnifier";
import Popper, { type PopperProps } from "../Popper";
import { alignments } from "../Popper/helpers";
import useTheme from "../styles/useTheme";
import TextField from "../TextField";
import type { MergeElementProps } from "../typings";
import {
  clamp,
  detectScrollBarWidth,
  generateUniqueString,
  getVar,
  HTMLElementType,
  useEventListener,
  useForkedRefs,
  useOnChange
} from "../utils";
import MenuContext from "./context";
import Item from "./Item";
import ItemGroup from "./ItemGroup";
import useStyles from "./styles";

interface MenuBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * An HTML element.
   * It's used to set the position of the menu.
   */
  anchorNodeReference: React.RefObject<HTMLElement>;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The menu positioning alignment.
   * @default "start"
   */
  alignment?: PopperProps["alignment"];
  /**
   * The `min-width` css property of the menu.
   */
  minWidth?: "anchorWidth" | number;
  /**
   * The `max-width` css property of the menu.
   */
  maxWidth?: "anchorWidth" | number;
  /**
   * The `placeholder` property of the search field.
   */
  searchPlaceholder?: string;
  /**
   * The empty statement text when search results are empty.
   */
  searchEmptyStatementText?: string;
  /**
   * If `true`, the menu will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * If `true`, the menu will be searchable.
   * @default false
   */
  searchable?: boolean;
  /**
   * If `true`, the menu will block the page's scrolling.
   * @default false
   */
  preventPageScrolling?: boolean;
  /**
   * If `true`, the menu will appear denser.
   * @default false
   */
  dense?: boolean;
  /**
   * If `true`, the menu will be open.
   * @default false
   */
  open?: boolean;
  /**
   * The Callback fires when the menu has opened.
   */
  onOpen?: () => void;
  /**
   * The Callback fires when the menu has closed.
   */
  onClose?: () => void;
  /**
   * The callback fires when the `Escape` key is released.
   */
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  /**
   * The Callback fires when user has clicked outside of the menu.
   */
  onOutsideClick?: (event: MouseEvent) => void;
  /**
   * The Callback fires when the user has clicked,
   * and determines whether the click occured outside of the menu or not.
   *
   * It only fires when the menu is open!
   */
  outsideClickDetector?: (event: MouseEvent) => boolean;
}

export type MenuProps = MergeElementProps<"div", MenuBaseProps>;

type Component = {
  (props: MenuProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<MenuProps> | undefined;
  displayName?: string | undefined;
};

const getDocument = () => (typeof document === "undefined" ? null : document);

const allowedAlignments = [...alignments, "middle"] as const;

const checkGroupChildren = (children?: React.ReactNode) => {
  const valids: React.ReactElement[] = [];

  if (children) {
    React.Children.forEach(children, child => {
      if (
        (React.isValidElement(child) && !isFragment(child)) ||
        (child as React.ReactElement).type === Item
      )
        valids.push(child as React.ReactElement);
    });
  }

  return valids;
};

const preventPageScroll = () => {
  document.body.style.overflow = "hidden";

  const hasPageOverflow = document.body.scrollHeight > window.innerHeight;

  if (hasPageOverflow)
    document.body.style.paddingRight = `${detectScrollBarWidth()}px`;
};

const allowPageScroll = () => {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};

const MenuBase = (props: MenuProps, refProp: React.Ref<HTMLDivElement>) => {
  const {
    className,
    onOpen,
    onClose,
    style,
    minWidth: minWidthProp,
    maxWidth: maxWidthProp,
    onOutsideClick,
    outsideClickDetector,
    onEscapeKeyDown,
    anchorNodeReference,
    children: childrenProp,
    searchPlaceholder: searchPlaceholderProp,
    searchEmptyStatementText: searchEmptyStatementTextProp,
    alignment: alignmentProp,
    role = "menu",
    open: openState = false,
    dense = false,
    searchable = false,
    preventPageScrolling = false,
    ...otherProps
  } = props;

  const classes = useStyles();
  const theme = useTheme();

  const [searchResult, setSearchResult] = React.useState<number[] | null>(null);
  const [searchValue, setSearchValue] = React.useState("");

  const [anchorNode, setAnchorNode] = React.useState<HTMLElement | null>(null);

  const focusIndex = React.useRef(-1);
  const focusedNode = React.useRef<HTMLDivElement | null>(null);
  const indexToNode = React.useRef(
    new Map<number, HTMLDivElement & { disabled?: boolean }>()
  );

  const rootRef = React.useRef<HTMLDivElement>();
  const ref = useForkedRefs(refProp, rootRef);

  const searchInputFocused = React.useRef(false);

  const isRTL = theme.direction === "rtl";
  const isSearchResultEmpty = !!searchResult && searchResult.length === 0;

  const searchPlaceholder =
    searchPlaceholderProp || (isRTL ? "جستجو" : "Search");

  const searchEmptyStatementText =
    searchEmptyStatementTextProp ||
    (isRTL ? "هیچ موردی یافت نشد!" : "There is no such option!");

  const alignment = getVar(
    alignmentProp,
    "start",
    !allowedAlignments.includes(alignmentProp ?? "start")
  );

  const resetFocus = () => {
    focusIndex.current = -1;
    focusedNode.current = null;
  };

  const reset = () => {
    setSearchValue("");
    setSearchResult(null);
    resetFocus();
    indexToNode.current = new Map<
      number,
      HTMLDivElement & { disabled?: boolean }
    >();
  };

  const searchChangeListener = (inputValue: string) => {
    const value = inputValue;

    let results: number[] | null = null;

    if (value.length > 0) {
      results = [];

      indexToNode.current.forEach((node, index) => {
        if (node.textContent?.toLowerCase().includes(value.toLowerCase()))
          (results as number[]).push(index);
      });
    }

    resetFocus();
    setSearchResult(results);
    setSearchValue(value);
  };

  const outsideClickHandler = React.useCallback(
    (e: MouseEvent) => {
      if (outsideClickDetector != null) {
        if (outsideClickDetector(e) && onOutsideClick) onOutsideClick(e);
      } else if (
        rootRef.current != null &&
        rootRef.current !== e.target &&
        !rootRef.current.contains(e.target as Node | null) &&
        anchorNode &&
        !anchorNode.contains(e.target as Node | null)
      ) {
        if (onOutsideClick) onOutsideClick(e);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onOutsideClick, outsideClickDetector]
  );

  const handleOpen = () => {
    onOpen?.();
    if (preventPageScrolling) preventPageScroll();
  };

  const handleClose = () => {
    onClose?.();
    if (preventPageScrolling) allowPageScroll();
  };

  useOnChange(openState, isOpen => {
    if (isOpen) handleOpen();
    else handleClose();

    reset();
  });

  const registerNode = (index: number, node: HTMLDivElement) =>
    void indexToNode.current.set(index, node);

  let itemIndex = 0;
  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) return null;

    if (isFragment(child)) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Menu component doesn't accept Fragment as a child."
      );

      return null;
    }

    if (
      (child as React.ReactElement).type !== Item &&
      (child as React.ReactElement).type !== ItemGroup
    ) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Menu component only accepts `Menu/Group` or `Menu/Item` components as children."
      );

      return null;
    }

    indexToNode.current = new Map<number, HTMLDivElement>();

    const isGroup = (child as React.ReactElement).type === ItemGroup;
    const isHidden = searchResult ? !searchResult.includes(itemIndex) : false;
    const currentIndex = itemIndex;

    if (isGroup) {
      itemIndex =
        itemIndex +
        checkGroupChildren(
          (child as React.ReactElement<{ children?: React.ReactNode }>).props
            .children
        ).length;
    } else itemIndex++;

    return React.cloneElement(child, {
      className: c(
        (child as React.ReactElement<{ className?: string }>).props.className,
        {
          [classes.group]: isGroup,
          [classes.option]: !isGroup
        }
      ),
      index: currentIndex,
      key: `${generateUniqueString()}`,
      ...(isGroup ? { visibleChilds: searchResult } : { hide: isHidden })
    });
  });

  const handleSearchFocus = React.useCallback(() => {
    searchInputFocused.current = true;
  }, []);

  const handleSearchBlur = React.useCallback(() => {
    searchInputFocused.current = false;
  }, []);

  const arrowDownListener = React.useCallback(() => {
    if (searchInputFocused.current) {
      focusIndex.current = -1;
      focusedNode.current = null;
    }

    const hasValidResults = searchResult !== null;

    const itemsSize = hasValidResults
      ? searchResult.length
      : indexToNode.current.size;

    if (itemsSize) {
      focusIndex.current = clamp(focusIndex.current + 1, 0, itemsSize - 1);

      const node = hasValidResults
        ? indexToNode.current.get(searchResult[focusIndex.current])
        : indexToNode.current.get(focusIndex.current);

      if (!node) return;

      if (!node.disabled) {
        node.focus();
        focusedNode.current = node;
      } else if (focusIndex.current !== itemsSize - 1) arrowDownListener();
      else focusIndex.current--;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResult]);

  const arrowUpListener = React.useCallback(() => {
    if (searchInputFocused.current) {
      focusIndex.current = -1;
      focusedNode.current = null;
    }

    const hasValidResults = searchResult !== null;

    const itemsSize = hasValidResults
      ? searchResult.length
      : indexToNode.current.size;

    if (itemsSize) {
      focusIndex.current =
        focusIndex.current === -1
          ? 0
          : clamp(focusIndex.current - 1, 0, itemsSize - 1);

      const node = hasValidResults
        ? indexToNode.current.get(searchResult[focusIndex.current])
        : indexToNode.current.get(focusIndex.current);

      if (!node) return;

      if (!node.disabled) {
        node.focus();
        focusedNode.current = node;
      } else if (focusIndex.current !== 0) arrowUpListener();
      else focusIndex.current++;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchResult]);

  const keyboardListener = React.useCallback(
    (e: KeyboardEvent) => {
      // do nothing if the event was already processed
      if (e.defaultPrevented) return;

      switch (e.key) {
        case "Down":
        case "ArrowDown":
          // preventing the default behaviour
          e.preventDefault();

          return arrowDownListener();
        case "Up":
        case "ArrowUp":
          // preventing the default behaviour
          e.preventDefault();

          return arrowUpListener();
        case "Escape" || "Esc" || "escape" || "esc":
          // preventing the default behaviour
          e.preventDefault();

          (document.activeElement as HTMLElement | null)?.blur();

          if (onEscapeKeyDown) onEscapeKeyDown(e);
          break;
        case " ":
          if (searchInputFocused.current) return;

          // preventing the default behaviour
          e.preventDefault();

          focusedNode.current?.click();
          break;
        default:
          return;
      }
    },
    [arrowDownListener, arrowUpListener, onEscapeKeyDown]
  );

  useEventListener(
    {
      target: getDocument(),
      eventType: "mousedown",
      handler: outsideClickHandler,
      options: { capture: true }
    },
    openState && onOutsideClick != null
  );

  useEventListener(
    {
      target: getDocument(),
      eventType: "keydown",
      handler: keyboardListener
    },
    openState
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => {
    const reference = anchorNodeReference.current;
    if (reference && reference !== anchorNode) setAnchorNode(reference);
  });

  const minWidth =
    minWidthProp === "anchorWidth" ? anchorNode?.offsetWidth : minWidthProp;
  const maxWidth =
    maxWidthProp === "anchorWidth" ? anchorNode?.offsetWidth : maxWidthProp;

  return !anchorNode ? null : (
    <Popper
      {...otherProps}
      ref={ref}
      className={c(classes.root, className, {
        [classes.dense]: dense,
        [classes.searchable]: searchable
      })}
      alignment={alignment}
      offset={4}
      autoPlacement={{ excludeSides: ["left", "right"] }}
      virtualAnchor={anchorNode}
      open={openState}
      style={{ ...style, minWidth, maxWidth }}
      renderPopperContent={() => (
        <div className={classes.container}>
          {searchable && (
            <div className={classes.searchRow}>
              <TextField
                fluid
                variant="filled"
                placeholder={searchPlaceholder}
                value={searchValue}
                size={dense ? "medium" : "large"}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                onChange={throttle((v: string) => {
                  searchChangeListener(v);
                }, 250)}
                leadingAdornment={
                  <InputAdornment variant="icon">
                    <Magnifier />
                  </InputAdornment>
                }
              />
            </div>
          )}
          <div className={classes.list} role={role} tabIndex={-1}>
            {isSearchResultEmpty && (
              <div className={classes.emptyStatement}>
                {searchEmptyStatementText}
              </div>
            )}
            <MenuContext.Provider value={{ registerNode, dense }}>
              {children}
            </MenuContext.Provider>
          </div>
        </div>
      )}
    />
  );
};

const Menu = React.forwardRef(MenuBase) as Component;

/* eslint-disable */
const nullable =
  <T,>(propType: PropTypes.Requireable<T>) =>
  (props: Record<string, unknown>, propName: string, ...rest: unknown[]) =>
    // @ts-ignore
    props[propName] === null ? null : propType(props, propName, ...rest);

type InferredTypeMap = React.WeakValidationMap<MenuProps>;

Menu.propTypes = {
  children: PropTypes.node,
  anchorNodeReference: PropTypes.exact({
    current: nullable(
      // @ts-ignore
      PropTypes.oneOfType([HTMLElementType, PropTypes.element]).isRequired
    )
  }) as InferredTypeMap["anchorNodeReference"],
  alignment: PropTypes.oneOf(allowedAlignments),
  minWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(["anchorWidth"])
  ]) as InferredTypeMap["minWidth"],
  maxWidth: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.oneOf(["anchorWidth"])
  ]) as InferredTypeMap["maxWidth"],
  style: PropTypes.object,
  className: PropTypes.string,
  role: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  searchEmptyStatementText: PropTypes.string,
  searchable: PropTypes.bool,
  preventPageScrolling: PropTypes.bool,
  dense: PropTypes.bool,
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onOutsideClick: PropTypes.func,
  outsideClickDetector: PropTypes.func,
  onEscapeKeyDown: PropTypes.func
};
/* eslint-enable */

export default Menu;
