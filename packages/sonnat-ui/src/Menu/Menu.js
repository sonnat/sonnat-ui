import React, { useState, useCallback, useRef, useEffect } from "react";
import { isFragment } from "react-is";
import PropTypes from "prop-types";
import throttle from "lodash.throttle";
import createClass from "classnames";
import TextField from "../TextField";
import PortalDestination from "../PortalDestination";
import InputAdornment from "../InputAdornment";
import Icon from "../Icon";
import MenuContext from "./context";
import { componentName as groupName } from "./ItemGroup";
import { componentName as itemName } from "./Item";
import {
  generateUniqueString,
  useEventListener,
  HTMLElementType,
  detectScrollBarWidth,
  useForkRef,
  getOffsetFromWindow,
  clamp
} from "../utils";
import { makeStyles, useTheme } from "../styles";

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
        boxShadow: `0 1px 2px 0 ${colors.createBlackColor({ alpha: 0.12 })}`
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
        ...useText({ fontSize: pxToRem(14), color: colors.text.hint }),
        display: "flex",
        alignItems: "center",
        height: pxToRem(40),
        justifyContent: "center",
        textAlign: "center"
      },
      searchable: {
        "&$dense $list": {
          height: `calc(100% - ${pxToRem(32)})`
        },
        "&:not($dense) $list": {
          height: `calc(100% - ${pxToRem(40)})`
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
  let report = { invalids: [], valids: [] };

  if (children) {
    React.Children.forEach(children, child => {
      if (
        !React.isValidElement(child) ||
        isFragment(child) ||
        child.type.displayName !== itemName
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

const Menu = React.memo(
  React.forwardRef(function Menu(props, refProp) {
    const {
      className,
      onOpen,
      onClose,
      minWidth,
      onOutsideClick,
      outsideClickDetector,
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

    const localClass = useStyles();
    const theme = useTheme();

    const [searchResult, setSearchResult] = useState(null);
    const [searchValue, setSearchValue] = useState("");
    const [meta, setMeta] = useState({ left: 0, top: 0, width: 0 });

    const focusIndex = useRef(-1);
    const focusedNode = useRef(null);
    const indexToNode = useRef(new Map());

    const rootRef = useRef();
    const ref = useForkRef(refProp, rootRef);

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

    const outsideClickHandler = useCallback(
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

      if (![groupName, itemName].includes(child.type.displayName)) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The Menu component only accepts `Menu/Group` or `Menu/Item` components."
        );

        return null;
      }

      indexToNode.current = new Map();

      const isGroup = child.type.displayName === groupName;
      const isHidden = searchResult ? !searchResult.includes(itemIndex) : false;
      const currentIndex = itemIndex;

      if (isGroup) {
        itemIndex =
          itemIndex + checkGroupChildren(child.props.children).valids.length;
      } else itemIndex++;

      return React.cloneElement(child, {
        className: createClass(child.props.className, {
          [localClass.group]: isGroup,
          [localClass.option]: !isGroup
        }),
        index: currentIndex,
        key: `${generateUniqueString()}`,
        ...(isGroup ? { visibleChilds: searchResult } : { hide: isHidden })
      });
    });

    useEffect(() => {
      if (openState) {
        if (onOpen) onOpen();
        if (preventPageScrolling) preventPageScroll();
      } else {
        if (onClose) onClose();
        if (preventPageScrolling) allowPageScroll();
      }

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openState]);

    const registerNode = (index, node) => {
      indexToNode.current.set(index, node);
    };

    const arrowDownListener = useCallback(() => {
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

    const arrowUpListener = useCallback(() => {
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

    const keyboardListener = useCallback(
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
          case "Enter":
            // preventing the default behaviour
            if (e.preventDefault) e.preventDefault();
            else e.returnValue = null;

            if (focusedNode.current) focusedNode.current.click();
            break;
          default:
            return;
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [arrowDownListener, arrowUpListener]
    );

    useEventListener(
      {
        element: !isSSR ? document : undefined,
        eventName: "mousedown",
        listener: outsideClickHandler,
        options: { useCapture: true }
      },
      openState && onOutsideClick != null
    );

    useEventListener(
      {
        element: !isSSR ? document : undefined,
        eventName: "keydown",
        listener: keyboardListener
      },
      openState
    );

    return (
      <MenuContext.Provider value={{ registerNode, dense }}>
        <PortalDestination aria-hidden={!openState}>
          <div
            tabIndex={-1}
            ref={ref}
            className={createClass(localClass.root, className, {
              [localClass.dense]: dense,
              [localClass.searchable]: searchable
            })}
            style={{
              ...style,
              ...meta
            }}
            {...otherProps}
          >
            {openState && (
              <div className={localClass.container}>
                {searchable && (
                  <div className={localClass.searchRow}>
                    <TextField
                      fluid
                      variant="filled"
                      placeholder={searchPlaceholder}
                      value={searchValue}
                      size={dense ? "small" : "medium"}
                      onChange={throttle(e => {
                        searchChangeListener(e);
                      }, 250)}
                      leadingAdornment={
                        <InputAdornment variant="icon">
                          <Icon identifier="magnifier" color="inherit" />
                        </InputAdornment>
                      }
                    />
                  </div>
                )}
                <div className={localClass.list} role={role} tabIndex={-1}>
                  {isSearchResultEmpty && (
                    <div className={localClass.emptyStatement}>
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
  })
);

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
  outsideClickDetector: PropTypes.func
};

export default Menu;
