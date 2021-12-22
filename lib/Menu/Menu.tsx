import c from "classnames";
import throttle from "lodash.throttle";
import PropTypes from "prop-types";
import * as React from "react";
import { isFragment } from "react-is";
import InputAdornment from "../InputAdornment";
import Magnifier from "../internals/icons/Magnifier";
import PortalDestination from "../PortalDestination";
import useTheme from "../styles/useTheme";
import TextField from "../TextField";
import type { MergeElementProps } from "../typings";
import {
  clamp,
  detectScrollBarWidth,
  generateUniqueString,
  getOffsetFromWindow,
  getVar,
  HTMLElementType,
  useEventListener,
  useForkedRefs
} from "../utils";
import MenuContext from "./context";
import Item from "./Item";
import ItemGroup from "./ItemGroup";
import useStyles from "./styles";

interface MenuBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * An HTML element, or a function that returns one.
   * It's used to set the position of the menu.
   */
  anchorNode?: HTMLElement | null;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The placement of the menu. (start from "left" or "right") */
  placement?: "left" | "right";
  /** The `min-width` property of the menu. */
  minWidth?: number;
  /** The `placeholder` property of the search field. */
  searchPlaceholder?: string;
  /** The empty statement text when search results are empty. */
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
  /** The Callback fires when the menu has opened. */
  onOpen?: () => void;
  /** The Callback fires when the menu has closed. */
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

const isSSR = typeof window === "undefined";

const allowedPlacements = ["left", "right"] as const;

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
    minWidth,
    onOutsideClick,
    outsideClickDetector,
    onEscapeKeyDown,
    anchorNode,
    children: childrenProp,
    searchPlaceholder: searchPlaceholderProp,
    searchEmptyStatementText: searchEmptyStatementTextProp,
    placement: placementProp,
    style = {},
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

  const [meta, setMeta] = React.useState({ left: 0, top: 0, width: 0 });

  const isFirstRender = React.useRef(true);

  const focusIndex = React.useRef(-1);
  const focusedNode = React.useRef<HTMLDivElement | null>(null);
  const indexToNode = React.useRef(
    new Map<number, HTMLDivElement & { disabled?: boolean }>()
  );

  const rootRef = React.useRef<HTMLDivElement>();
  const ref = useForkedRefs(refProp, rootRef);

  const isRTL = theme.direction === "rtl";
  const isSearchResultEmpty = !!searchResult && searchResult.length === 0;

  const searchPlaceholder =
    searchPlaceholderProp || (isRTL ? "جستجو" : "Search");

  const searchEmptyStatementText =
    searchEmptyStatementTextProp ||
    (isRTL ? "هیچ موردی یافت نشد!" : "There is no such option!");

  const placement = getVar(
    placementProp,
    isRTL ? "right" : "left",
    !allowedPlacements.includes(placementProp || isRTL ? "right" : "left")
  );

  const getAnchorMeta = () => {
    let meta;

    if (anchorNode) {
      const { left, top } = getOffsetFromWindow(anchorNode);

      meta = {
        offsetWidth: anchorNode.offsetWidth,
        offsetHeight: anchorNode.offsetHeight,
        top,
        left,
        right: left + anchorNode.offsetWidth,
        bottom: top + anchorNode.offsetHeight
      };
    }

    return meta;
  };

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

  const handleOpen = () => {
    if (onOpen) onOpen();
    if (preventPageScrolling) preventPageScroll();
  };

  const handleClose = () => {
    if (onClose) onClose();
    if (preventPageScrolling) allowPageScroll();
  };

  React.useEffect(() => {
    const shouldCalc = isSSR ? false : !isFirstRender.current;

    if (shouldCalc) {
      if (openState) handleOpen();
      else handleClose();

      const anchorMeta = getAnchorMeta();

      if (anchorMeta) {
        let newMeta: typeof meta = {
          width: clamp(
            anchorMeta.offsetWidth,
            minWidth || 0,
            document.body.offsetWidth - anchorMeta.left
          ),
          top: anchorMeta.top + anchorMeta.offsetHeight,
          left: 0
        };

        if (placement === "left") {
          newMeta = { ...newMeta, left: anchorMeta.left };
        } else if (placement === "right") {
          newMeta = { ...newMeta, left: anchorMeta.right - newMeta.width };
        }

        setMeta(newMeta);
      }
      reset();
    } else if (!isSSR) isFirstRender.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openState]);

  const registerNode = (index: number, node: HTMLDivElement) => {
    indexToNode.current.set(index, node);
  };

  const arrowDownListener = React.useCallback(() => {
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
          // preventing the default behaviour
          e.preventDefault();

          if (focusedNode.current) focusedNode.current.click();
          break;
        default:
          return;
      }
    },
    [arrowDownListener, arrowUpListener, onEscapeKeyDown]
  );

  /* eslint-disable react-hooks/rules-of-hooks */
  if (!isSSR) {
    useEventListener(
      {
        target: document,
        eventType: "mousedown",
        handler: outsideClickHandler,
        options: { capture: true }
      },
      openState && onOutsideClick != null
    );

    useEventListener(
      {
        target: document,
        eventType: "keydown",
        handler: keyboardListener
      },
      openState
    );
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  return (
    <MenuContext.Provider value={{ registerNode, dense }}>
      <PortalDestination aria-hidden={!openState}>
        <div
          tabIndex={-1}
          ref={ref}
          className={c(classes.root, className, {
            [classes.dense]: dense,
            [classes.searchable]: searchable
          })}
          style={{
            ...style,
            ...meta
          }}
          {...otherProps}
        >
          {openState && (
            <div className={classes.container}>
              {searchable && (
                <div className={classes.searchRow}>
                  <TextField
                    fluid
                    variant="filled"
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    size={dense ? "medium" : "large"}
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
                {children}
              </div>
            </div>
          )}
        </div>
      </PortalDestination>
    </MenuContext.Provider>
  );
};

const Menu = React.forwardRef(MenuBase) as Component;

/* eslint-disable */
Menu.propTypes = {
  children: PropTypes.node,
  // @ts-ignore
  anchorNode: PropTypes.oneOfType([HTMLElementType, PropTypes.element]),
  placement: PropTypes.oneOf(allowedPlacements),
  minWidth: PropTypes.number,
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
