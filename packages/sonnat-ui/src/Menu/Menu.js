import clx from "classnames";
import throttle from "lodash.throttle";
import PropTypes from "prop-types";
import React from "react";
import { isFragment } from "react-is";
import InputAdornment from "../InputAdornment";
import Magnifier from "../internals/icons/Magnifier";
import PortalDestination from "../PortalDestination";
import { makeStyles, useTheme } from "../styles";
import TextField from "../TextField";
import {
  clamp,
  detectScrollBarWidth,
  generateUniqueString,
  getOffsetFromWindow,
  HTMLElementType,
  useEventListener,
  useForkRef
} from "../utils";
import MenuContext from "./context";
import Item from "./Item";
import ItemGroup from "./ItemGroup";

const isSSR = typeof window === "undefined";

const componentName = "Menu";

const allowedPlacements = ["left", "right"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      zIndexes,
      direction,
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    const boxShadow = {
      darkMode: `0 4px 4px -4px rgba(0, 0, 0, 0.12),
      0 8px 10px 1px rgba(0, 0, 0, 0.08),
      0 4px 8px 2px rgba(0, 0, 0, 0.04),
      0 0 0 1px rgba(0, 0, 0, 0.12)`,
      lightMode: `0 1px 6px 0 rgba(0, 0, 0, 0.04),
      0 -8px 32px -4px rgba(0, 0, 0, 0.08),
      0 16px 24px -6px rgba(0, 0, 0, 0.04)`
    };

    return {
      root: {
        position: "absolute",
        zIndex: zIndexes.popover,
        direction,
        fontFamily: fontFamily[direction],
        outline: "none"
      },
      container: {
        marginTop: pxToRem(4),
        width: "100%",
        height: "100%",
        borderRadius: pxToRem(4),
        boxShadow: !darkMode ? boxShadow.lightMode : boxShadow.darkMode,
        backgroundColor: !darkMode
          ? colors.background.origin
          : colors.background.level[1],
        zIndex: 1
      },
      searchRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: `${pxToRem(4)} ${pxToRem(4)} 0 0`,
        padding: pxToRem(4)
      },
      list: {
        width: "100%",
        height: "100%",
        maxHeight: pxToRem(320),
        overflow: "auto",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        outline: "none"
      },
      group: {
        borderBottom: `1px solid ${colors.divider}`,
        "&:last-child": {
          borderBottom: "none"
        }
      },
      option: {
        "& + $group": {
          borderTop: `1px solid ${colors.divider}`
        }
      },
      emptyStatement: {
        ...useText({
          fontSize: pxToRem(14),
          lineHeight: 1.5714285714,
          color: colors.text.hint
        }),
        display: "flex",
        alignItems: "center",
        height: pxToRem(40),
        justifyContent: "center",
        textAlign: "center"
      },
      searchable: {
        "&$dense $list": {
          height: `calc(100% - ${pxToRem(40)})`
        },
        "&:not($dense) $list": {
          height: `calc(100% - ${pxToRem(48)})`
        }
      },
      dense: {
        "& $list": {
          maxHeight: pxToRem(256)
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const checkGroupChildren = children => {
  const report = { invalids: [], valids: [] };

  if (children) {
    React.Children.forEach(children, child => {
      if (
        !React.isValidElement(child) ||
        isFragment(child) ||
        child.type !== Item
      ) {
        report.invalids.push(child);
      } else report.valids.push(child);
    });
  }

  return report;
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

const Menu = React.forwardRef(function Menu(props, refProp) {
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

  const [searchResult, setSearchResult] = React.useState(null);
  const [searchValue, setSearchValue] = React.useState("");

  const [meta, setMeta] = React.useState({ left: 0, top: 0, width: 0 });

  const isFirstRender = React.useRef(true);

  const focusIndex = React.useRef(-1);
  const focusedNode = React.useRef(null);
  const indexToNode = React.useRef(new Map());

  const rootRef = React.useRef(null);
  const ref = useForkRef(refProp, rootRef);

  const listRef = React.useRef(null);

  const isRTL = theme.direction === "rtl";
  const isSearchResultEmpty = !!searchResult && searchResult.length === 0;

  const searchPlaceholder =
    searchPlaceholderProp || (isRTL ? "جستجو" : "Search");

  const searchEmptyStatementText =
    searchEmptyStatementTextProp ||
    (isRTL ? "هیچ موردی یافت نشد!" : "There is no such option!");

  const placement = placementProp || (isRTL ? "right" : "left");

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
    indexToNode.current = new Map();
  };

  const searchChangeListener = e => {
    const value = e.target.value;
    let results = null;

    if (value.length > 0) {
      results = [];

      indexToNode.current.forEach((el, key) => {
        const content = el.textContent;
        if (content.toLowerCase().includes(value.toLowerCase())) {
          results.push(key);
        }
      });
    }

    resetFocus();
    setSearchResult(results);
    setSearchValue(value);
  };

  const outsideClickHandler = React.useCallback(
    e => {
      if (outsideClickDetector != null) {
        if (outsideClickDetector(e) && onOutsideClick) onOutsideClick(e);
      } else if (
        rootRef.current !== null &&
        rootRef.current !== e.target &&
        !rootRef.current.contains(e.target) &&
        anchorNode &&
        !anchorNode.contains(e.target)
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
        "Sonnat: The Menu component doesn't accept a Fragment as a child."
      );

      return null;
    }

    if (child.type !== Item && child.type !== ItemGroup) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Menu component only accepts `Menu/Group` or `Menu/Item` components."
      );

      return null;
    }

    indexToNode.current = new Map();

    const isGroup = child.type === ItemGroup;
    const isHidden = searchResult ? !searchResult.includes(itemIndex) : false;
    const currentIndex = itemIndex;

    if (isGroup) {
      itemIndex =
        itemIndex + checkGroupChildren(child.props.children).valids.length;
    } else itemIndex++;

    return React.cloneElement(child, {
      className: clx(child.props.className, {
        [classes.group]: isGroup,
        [classes.option]: !isGroup
      }),
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
        let newMeta = {
          width: clamp(
            anchorMeta.offsetWidth,
            minWidth || 0,
            document.body.offsetWidth - anchorMeta.left
          ),
          top: anchorMeta.top + anchorMeta.offsetHeight
        };

        if (allowedPlacements.includes(placement)) {
          if (placement === "left") {
            newMeta = { ...newMeta, left: anchorMeta.left };
          } else if (placement === "right") {
            newMeta = { ...newMeta, left: anchorMeta.right - newMeta.width };
          }
        }

        setMeta(newMeta);
      }
      reset();
    } else if (!isSSR) {
      isFirstRender.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openState]);

  const registerNode = (index, node) => {
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
    e => {
      // do nothing if the event was already processed
      if (e.defaultPrevented) return;

      switch (e.key) {
        case "Down":
        case "ArrowDown":
          // preventing the default behaviour
          if (e.preventDefault) e.preventDefault();
          else e.returnValue = null;

          return arrowDownListener();
        case "Up":
        case "ArrowUp":
          // preventing the default behaviour
          if (e.preventDefault) e.preventDefault();
          else e.returnValue = null;

          return arrowUpListener();
        case "Escape" || "Esc" || "escape" || "esc":
          // preventing the default behaviour
          if (e.preventDefault) e.preventDefault();
          else e.returnValue = null;

          document.activeElement.blur();

          if (onEscapeKeyDown) onEscapeKeyDown(e);
          break;
        case " ":
          // preventing the default behaviour
          if (e.preventDefault) e.preventDefault();
          else e.returnValue = null;

          if (focusedNode.current) focusedNode.current.click();
          break;
        default:
          return;
      }
    },
    [arrowDownListener, arrowUpListener, onEscapeKeyDown]
  );

  if (!isSSR) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEventListener(
      {
        element: document,
        eventName: "mousedown",
        listener: outsideClickHandler,
        options: { useCapture: true }
      },
      openState && onOutsideClick != null
    );

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEventListener(
      {
        element: document,
        eventName: "keydown",
        listener: keyboardListener
      },
      openState
    );
  }

  return (
    <MenuContext.Provider value={{ registerNode, dense }}>
      <PortalDestination aria-hidden={!openState}>
        <div
          tabIndex={-1}
          ref={ref}
          className={clx(classes.root, className, {
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
                    onChange={throttle(e => {
                      searchChangeListener(e);
                    }, 250)}
                    leadingAdornment={
                      <InputAdornment variant="icon">
                        <Magnifier />
                      </InputAdornment>
                    }
                  />
                </div>
              )}
              <div
                ref={listRef}
                className={classes.list}
                role={role}
                tabIndex={-1}
              >
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
});

Menu.displayName = componentName;

Menu.propTypes = {
  children: PropTypes.node,
  anchorNode: PropTypes.oneOfType([
    HTMLElementType,
    PropTypes.instanceOf(React.Component),
    PropTypes.func
  ]),
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

export default Menu;
