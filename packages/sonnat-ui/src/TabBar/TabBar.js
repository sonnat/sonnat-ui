import clx from "classnames";
import throttle from "lodash.throttle";
import PropTypes from "prop-types";
import * as React from "react";
import { isFragment } from "react-is";
import { withResizeDetector } from "react-resize-detector";
import { ChevronLeftLarge, ChevronRightLarge } from "../internals/icons";
import { makeStyles, useTheme } from "../styles";
import {
  detectScrollType,
  getNormalizedScrollLeft,
  setRef,
  useConstantProp,
  useControlled,
  getVar
} from "../utils";
import TabBarContext from "./context";
import { componentName as childName } from "./Tab";

const componentName = "TabBar";

const allowedVariants = ["scrollable", "fluid"];
const allowedSizes = ["large", "medium", "small"];
const allowedHandleVisibility = ["auto", "off"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      mixins: { useIconWrapper },
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "flex",
        position: "relative",
        overflow: "hidden"
      },
      scrollBehavior: {
        scrollBehavior: "smooth",
        WebkitOverflowScrolling: "touch"
      },
      listWrapper: {
        extend: "scrollBehavior",
        flex: [[1, 0]],
        margin: 0,
        display: "flex",
        position: "relative",
        minHeight: pxToRem(64),
        alignItems: "flex-start",
        justifyContent: "flex-start",
        zIndex: "1",
        "&::-webkit-scrollbar-track": {
          display: "none",
          backgroundColor: colors.transparent
        },
        "&::-webkit-scrollbar": {
          display: "none",
          backgroundColor: colors.transparent
        },
        "&::-webkit-scrollbar-thumb": {
          display: "none",
          backgroundColor: colors.transparent
        },
        "&::-webkit-scrollbar-thumb:hover": {
          display: "none",
          backgroundColor: colors.transparent
        }
      },
      listContainer: {
        extend: "scrollBehavior",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        "&::-webkit-scrollbar-track": {
          display: "none",
          backgroundColor: colors.transparent
        },
        "&::-webkit-scrollbar": {
          display: "none",
          backgroundColor: colors.transparent
        },
        "&::-webkit-scrollbar-thumb": {
          display: "none",
          backgroundColor: colors.transparent
        },
        "&::-webkit-scrollbar-thumb:hover": {
          display: "none",
          backgroundColor: colors.transparent
        }
      },
      indicatorSlider: {
        left: 0,
        bottom: 0,
        height: pxToRem(2),
        width: "100%",
        content: '""',
        position: "absolute",
        transition:
          "transform 250ms cubic-bezier(0.4, 0, 0.2, 1), background-color 125ms ease 250ms, left 250ms cubic-bezier(0.4, 0, 0.2, 1)",
        backgroundColor: colors.transparent,
        transformOrigin: "0% 0%"
      },
      fader: {
        backgroundColor: colors.transparent,
        zIndex: 2,
        display: "flex",
        width: pxToRem(32),
        minWidth: pxToRem(32),
        height: "100%",
        position: "relative",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: "0",
        "&:hover": {
          "& $faderIcon": {
            color: !darkMode ? colors.primary.origin : colors.primary.light
          }
        }
      },
      startFader: {},
      endFader: {},
      large: {
        height: pxToRem(48),
        "& $indicatorSlider": { top: pxToRem(48) }
      },
      medium: {
        height: pxToRem(40),
        "& $indicatorSlider": { top: pxToRem(40) }
      },
      small: {
        height: pxToRem(32),
        "& $indicatorSlider": { top: pxToRem(32) }
      },
      disabledFader: {
        visibility: "hidden"
      },
      faderIcon: {
        ...useIconWrapper(16),
        color: colors.text.hint,
        transition: "color 360ms ease"
      },
      scrollable: {
        "& $listWrapper": {
          overflowX: "auto"
        }
      },
      fluid: {
        width: "100%",
        "& $listContainer": { flex: [[1, 0]] }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const mapIdentifierToIndex = (value, index, map) => {
  map.set(value, index);
  return map;
};

const getIndexOfIdentifier = (value, map) => {
  return map.get(value);
};

const TabBar = React.memo(
  React.forwardRef(function TabBar(props, ref) {
    const {
      // These properties are passed from `react-resize-detector`.
      // We are trying to exclude them from the `otherProps` property.
      /* eslint-disable no-unused-vars, react/prop-types */
      targetRef,
      height: rootHeight,
      /* eslint-enable no-unused-vars, react/prop-types */
      className,
      activeTab,
      defaultActiveTab,
      onChange,
      children: childrenProp,
      width: parentWidth,
      scrollHandleVisibility: hVisProp = "auto",
      variant: variantProp = "scrollable",
      size: sizeProp = "medium",
      ...otherProps
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const isRtl = theme.direction === "rtl";

    const size = getVar(sizeProp, "medium", !allowedSizes.includes(sizeProp));

    const variant = getVar(
      variantProp,
      "scrollable",
      !allowedVariants.includes(variantProp)
    );

    const scrollHandleVisibility = getVar(
      hVisProp,
      "auto",
      !allowedHandleVisibility.includes(hVisProp)
    );

    const isFluid = useConstantProp(variant === "fluid", false, {
      componentName,
      propName: "variant"
    });

    const isScrollable = useConstantProp(variant === "scrollable", true, {
      componentName,
      propName: "variant"
    });

    const padding = 0;

    const indicatorRef = React.useRef();
    const parentRef = React.useRef();
    const scrollerRef = React.useRef();
    const listRef = React.useRef();

    const identifierToIndex = new Map();

    const [indicatorState, setIndicatorState] = React.useState({
      scaleX: 1,
      x: 0,
      bgColor: theme.colors.transparent
    });

    const [isResized, setResized] = React.useState(false);
    const [scrollButtonsDisplayState, setScrollButtonsDisplayState] =
      React.useState({
        start: false,
        end: false
      });

    const indicatorProps = {
      className: classes.indicatorSlider,
      style: {
        backgroundColor: indicatorState.bgColor,
        left: indicatorState.x,
        transform: `translateY(-100%) scaleX(${indicatorState.scaleX})`,
        WebkitTransform: `translateY(-100%) scaleX(${indicatorState.scaleX})`,
        MozTransform: `translateY(-100%) scaleX(${indicatorState.scaleX})`,
        msTransform: `translateY(-100%) scaleX(${indicatorState.scaleX})`
      },
      ref: node => {
        indicatorRef.current = node;
      }
    };

    const [value, setValue] = useControlled(
      activeTab,
      defaultActiveTab,
      componentName
    );

    let childIndex = 0;
    const children = React.Children.map(childrenProp, child => {
      if (!React.isValidElement(child)) return null;

      if (isFragment(child)) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The TabBar component doesn't accept a Fragment as a child."
        );
      }

      if (child.type.displayName !== childName) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The TabBar component only accepts `TabBar/Tab` as a child."
        );
      }

      const childIdentifier =
        child.props.identifier === undefined
          ? childIndex
          : child.props.identifier;

      mapIdentifierToIndex(childIdentifier, childIndex, identifierToIndex);

      childIndex += 1;

      return React.cloneElement(child, {
        active: childIdentifier === value,
        identifier: childIdentifier
      });
    });

    const getChildren = index => {
      return listRef.current.children[index];
    };

    const getScrollerMeta = () => {
      const scrollerNode = scrollerRef.current;
      let meta;

      if (scrollerNode) {
        const rect = scrollerNode.getBoundingClientRect();

        meta = {
          clientWidth: scrollerNode.clientWidth,
          scrollLeft: scrollerNode.scrollLeft,
          scrollTop: scrollerNode.scrollTop,
          scrollLeftNormalized: getNormalizedScrollLeft(
            scrollerNode,
            theme.direction
          ),
          scrollWidth: scrollerNode.scrollWidth,
          top: rect.top,
          left: rect.left,
          right: rect.right,
          bottom: rect.bottom
        };
      }

      return meta;
    };

    const getTabMeta = () => {
      const scrollerNode = scrollerRef.current;
      let meta;

      if (scrollerNode && value != null) {
        const tab = getChildren(getIndexOfIdentifier(value, identifierToIndex));

        if (tab) {
          const tabRect = tab.getBoundingClientRect();

          meta = {
            clientWidth: tab.clientWidth,
            clientHeight: tab.clientHeight,
            top: tabRect.top,
            left: tabRect.left,
            right: tabRect.right,
            bottom: tabRect.bottom
          };
        } else if (process.env.NODE_ENV !== "production") {
          let validValues = "";

          if (identifierToIndex.keys) {
            const idKeys = Array.from(identifierToIndex.keys());
            validValues = idKeys.reduce((result, key, i) => {
              return (result +=
                (typeof key === "string" ? ` '${key}'` : ` ${key}`) +
                (i < idKeys.length - 1 ? "," : ""));
            }, "");
          }

          // eslint-disable-next-line no-console
          console.error(
            [
              `Sonnat: The identifier provided to the TabBar component is invalid. None of the TabBar's children match with ${typeof value} \`${
                typeof value === "string" ? `'${value}'` : value
              }\`.`,
              validValues.length > 0
                ? `You can provide one of the following values: { ${validValues.trim()} }.`
                : null
            ].join("\n")
          );
        }
      }

      return meta;
    };

    const updateIndicatorState = () => {
      const tabMeta = getTabMeta();
      const scrollerMeta = getScrollerMeta();

      if (tabMeta && scrollerMeta) {
        let x = 0;

        const correction = isRtl
          ? scrollerMeta.scrollLeftNormalized +
            scrollerMeta.clientWidth -
            scrollerMeta.scrollWidth
          : scrollerMeta.scrollLeft;

        x = tabMeta.left - scrollerMeta.left + correction;

        setIndicatorState({
          x,
          scaleX: tabMeta.clientWidth / scrollerMeta.clientWidth,
          bgColor: theme.darkMode
            ? theme.colors.primary.origin
            : theme.colors.primary.light
        });
      }
    };

    const getScrollSize = () => {
      const containerSize = scrollerRef.current.clientWidth;
      let totalSize = 0;

      const children = Array.from(listRef.current.children);

      for (let i = 0; i < children.length; i += 1) {
        const tab = children[i];

        if (totalSize + tab.clientWidth > containerSize) break;
        totalSize += tab.clientWidth;
      }
      return totalSize + 2 * padding;
    };

    const getAvgScrollAmount = () => {
      const children = Array.from(listRef.current.children);

      return getScrollSize() / children.length;
    };

    const updateScrollButtonState = () => {
      if (isScrollable && scrollHandleVisibility !== "off") {
        const { scrollWidth, clientWidth } = scrollerRef.current;

        const scrollLeft = getNormalizedScrollLeft(
          scrollerRef.current,
          theme.direction
        );

        // use 1 for the potential rounding error with browser zooms.
        const showStartScrollButton = isRtl
          ? scrollLeft < scrollWidth - clientWidth - 1
          : scrollLeft > 1;
        const showEndScrollButton = !isRtl
          ? scrollLeft < scrollWidth - clientWidth - 1
          : scrollLeft > 1;

        if (
          showStartScrollButton !== scrollButtonsDisplayState.start ||
          showEndScrollButton !== scrollButtonsDisplayState.end
        ) {
          setScrollButtonsDisplayState({
            start: showStartScrollButton,
            end: showEndScrollButton
          });
        }
      }
    };

    const scroll = amount => {
      // TODO: animate the scrollLeft value change
      scrollerRef.current.scrollLeft = amount;
    };

    const moveScroller = amount => {
      let scrollValue = scrollerRef.current.scrollLeft;

      scrollValue += amount * (isRtl ? -1 : 1);
      // Fix for Edge
      scrollValue *= isRtl && detectScrollType() === "reverse" ? -1 : 1;

      scroll(scrollValue);
    };

    const scrollIntoView = () => {
      const scrollerMeta = getScrollerMeta();
      const tabMeta = getTabMeta();

      if (!tabMeta || !scrollerMeta) return;

      if (tabMeta.left - scrollerMeta.left < padding) {
        // left side of tab is out of view
        scroll(
          scrollerMeta.scrollLeft + (tabMeta.left - scrollerMeta.left) - padding
        );
      } else if (tabMeta.right - scrollerMeta.right > -padding) {
        // right side of tab is out of view
        scroll(
          scrollerMeta.scrollLeft +
            (tabMeta.right - scrollerMeta.right) +
            padding
        );
      }
    };

    const changeListener = React.useCallback(
      (e, identifier) => {
        if (onChange) onChange(e, identifier);

        // Switch tab if-and-only-if it is a uncontrolled component
        setValue(identifier);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onChange]
    );

    const startScrollButtonHandler = () => {
      moveScroller(-getAvgScrollAmount());
    };

    const endScrollButtonHandler = () => {
      moveScroller(getAvgScrollAmount());
    };

    React.useEffect(() => {
      if (parentWidth) setResized(true);
    }, [parentWidth]);

    if (isResized) {
      updateIndicatorState();
      updateScrollButtonState();
      setResized(false);
    }

    React.useEffect(() => {
      updateIndicatorState();
      updateScrollButtonState();
      scrollIntoView();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const context = React.useMemo(
      () => ({
        fluid: isFluid,
        scrollable: isScrollable,
        onChange: changeListener,
        size
      }),
      [isFluid, isScrollable, changeListener, size]
    );

    return (
      <div
        className={clx(classes.root, className, classes[size], {
          [classes.scrollable]: isScrollable,
          [classes.fluid]: isFluid
        })}
        ref={node => {
          if (ref) setRef(ref, node);
          parentRef.current = node;
        }}
        {...otherProps}
      >
        {isScrollable && (
          <div
            aria-disabled={!scrollButtonsDisplayState.start}
            role="button"
            className={clx(classes.startFader, classes.fader, {
              [classes.disabledFader]: !scrollButtonsDisplayState.start
            })}
            onClick={startScrollButtonHandler}
          >
            <i className={classes.faderIcon}>
              {isRtl ? <ChevronRightLarge /> : <ChevronLeftLarge />}
            </i>
          </div>
        )}
        <div
          ref={scrollerRef}
          className={classes.listWrapper}
          onScroll={throttle(() => {
            updateScrollButtonState();
          }, 250)}
        >
          <div {...indicatorProps}></div>
          <div ref={listRef} className={classes.listContainer} role="tablist">
            <TabBarContext.Provider value={context}>
              {children}
            </TabBarContext.Provider>
          </div>
        </div>
        {isScrollable && (
          <div
            aria-disabled={!scrollButtonsDisplayState.end}
            role="button"
            className={clx(classes.endFader, classes.fader, {
              [classes.disabledFader]: !scrollButtonsDisplayState.end
            })}
            onClick={endScrollButtonHandler}
          >
            <i className={classes.faderIcon}>
              {isRtl ? <ChevronLeftLarge /> : <ChevronRightLarge />}
            </i>
          </div>
        )}
      </div>
    );
  })
);

TabBar.displayName = componentName;

TabBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultActiveTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.number,
  scrollHandleVisibility: PropTypes.oneOf(allowedHandleVisibility),
  variant: PropTypes.oneOf(allowedVariants),
  size: PropTypes.oneOf(allowedSizes),
  onChange: PropTypes.func
};

export default withResizeDetector(TabBar, {
  handleWidth: true,
  skipOnMount: true,
  refreshMode: "debounce",
  refreshRate: 250
});
