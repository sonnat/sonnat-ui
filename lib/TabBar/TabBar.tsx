import c from "classnames";
import throttle from "lodash.throttle";
import PropTypes from "prop-types";
import * as React from "react";
import { isFragment } from "react-is";
import { ChevronLeftLarge, ChevronRightLarge } from "../internals/icons";
import useTheme from "../styles/useTheme";
import type { MergeElementProps } from "../typings";
import {
  clamp,
  detectScrollType,
  getNormalizedScrollLeft,
  getVar,
  setRef,
  useConstantProp,
  useControlledProp,
  useResizeSensor
} from "../utils";
import TabBarContext from "./context";
import useStyles from "./styles";
import Tab, { TabProps } from "./Tab";

interface TabBarBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The currently selected tab. */
  activeTab?: number | string;
  /** The default selected tab. Use when the component is not controlled. */
  defaultActiveTab?: number | string;
  /**
   * If `true`, will make the tabbar and the tabs dense.
   * @default false
   */
  dense?: boolean;
  /**
   * Determines the behavior of scroll buttons when `variant="scrollable"`:
   * - `auto` will automatically show them on overflow.
   * - `off` wont show them.
   * @default "auto"
   */
  scrollHandleVisibility?: "auto" | "off";
  /**
   * The variant of the tabbar.
   * @default "fluid"
   */
  variant?: "scrollable" | "fluid";
  /**
   * The size of the tabbar.
   * @default "medium"
   */
  size?: "large" | "medium" | "small";
  /**
   * The Callback fires when the state has changed.
   */
  onChange?: (identifier: number | string) => void;
}

export type TabBarProps = MergeElementProps<"div", TabBarBaseProps>;

type Component = {
  (props: TabBarProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TabBarProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["scrollable", "fluid"] as const;
const allowedSizes = ["large", "medium", "small"] as const;
const allowedHandleVisibility = ["auto", "off"] as const;

const mapIdentifierToIndex = (
  value: string | number,
  index: number,
  map: Map<string | number, number>
) => void map.set(value, index);

const getIndexOfIdentifier = (
  value: string | number,
  map: Map<string | number, number>
) => map.get(value);

const TabBarBase = (props: TabBarProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className,
    activeTab,
    defaultActiveTab,
    onChange,
    children: childrenProp,
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
    componentName: "TabBar",
    propName: "variant"
  });

  const isScrollable = useConstantProp(variant === "scrollable", true, {
    componentName: "TabBar",
    propName: "variant"
  });

  const padding = 0;

  const indicatorRef = React.useRef<HTMLDivElement | null>();
  const parentRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLDivElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  const { width: parentWidth, registerNode: registerResizeSensor } =
    useResizeSensor({ mode: "debounce" });

  const identifierToIndex = new Map<string | number, number>();

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
    ref: (node: HTMLDivElement | null) => {
      indicatorRef.current = node;
    }
  };

  const [value, setValue] = useControlledProp(activeTab, defaultActiveTab, 0);

  let childIndex = 0;
  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) return null;

    if (isFragment(child)) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The TabBar component doesn't accept a Fragment as a child."
      );
    }

    if (child.type !== Tab) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The TabBar component only accepts `TabBar/Tab` as a child."
      );
    }

    const childProps = (child as React.ReactElement<TabProps>).props;

    const childIdentifier =
      childProps.identifier === undefined ? childIndex : childProps.identifier;

    mapIdentifierToIndex(childIdentifier, childIndex, identifierToIndex);

    childIndex += 1;

    return React.cloneElement(child, {
      active: childIdentifier === value,
      identifier: childIdentifier
    });
  });

  const getChildren = (index?: number) => {
    if (index == null) return;
    return listRef.current?.children[index] as HTMLDivElement | undefined;
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
          validValues = idKeys.reduce<string>((result, key, i) => {
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
    let totalSize = 0;

    const containerSize = scrollerRef.current?.clientWidth || 0;
    const children = Array.from(listRef.current?.children || []);

    for (let i = 0; i < children.length; i += 1) {
      const tab = children[i];

      if (totalSize + tab.clientWidth > containerSize) break;
      totalSize += tab.clientWidth;
    }

    return totalSize + 2 * padding;
  };

  const getAvgScrollAmount = () => {
    const children = Array.from(listRef.current?.children || []);

    return children.length ? getScrollSize() / children.length : 0;
  };

  const updateScrollButtonState = () => {
    if (!scrollerRef.current) return;
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

  const scroll = (amount: number) => {
    if (!scrollerRef.current) return;
    // TODO: animate the scrollLeft value change
    scrollerRef.current.scrollLeft = amount;
  };

  const moveScroller = (amount: number) => {
    if (!scrollerRef.current) return;

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
        scrollerMeta.scrollLeft + (tabMeta.right - scrollerMeta.right) + padding
      );
    }
  };

  const changeListener = React.useCallback(
    (identifier: string | number) => {
      if (onChange) onChange(identifier);

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

  const focusLeftAdjacentTab = (identifier: number | string) => {
    const tabIndex = identifierToIndex.get(identifier);
    const childrenLength = Array.from(listRef.current?.children || []).length;

    if (tabIndex == null || tabIndex - 1 < 0) return;

    const child = getChildren(clamp(tabIndex - 1, 0, childrenLength));

    child?.click();
    child?.focus();
  };

  const focusRightAdjacentTab = (identifier: number | string) => {
    const tabIndex = identifierToIndex.get(identifier);
    const childrenLength = Array.from(listRef.current?.children || []).length;

    if (tabIndex == null || tabIndex + 1 >= childrenLength) return;

    const child = getChildren(clamp(tabIndex + 1, 0, childrenLength - 1));

    child?.click();
    child?.focus();
  };

  const context = React.useMemo(
    () => ({
      fluid: isFluid,
      scrollable: isScrollable,
      onChange: changeListener,
      focusLeftAdjacentTab,
      focusRightAdjacentTab,
      isRtl,
      size
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isFluid, isScrollable, changeListener, size]
  );

  return (
    <div
      className={c(classes.root, className, classes[size], {
        [classes.scrollable]: isScrollable,
        [classes.fluid]: isFluid
      })}
      ref={node => {
        if (ref) setRef(ref, node);
        setRef(parentRef, node);
        registerResizeSensor(node);
      }}
      {...otherProps}
    >
      {isScrollable && (
        <div
          aria-disabled={!scrollButtonsDisplayState.start}
          role="button"
          className={c(classes.startFader, classes.fader, {
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
          className={c(classes.endFader, classes.fader, {
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
};

const TabBar = React.forwardRef(TabBarBase) as Component;

TabBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  activeTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultActiveTab: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  scrollHandleVisibility: PropTypes.oneOf(allowedHandleVisibility),
  variant: PropTypes.oneOf(allowedVariants),
  size: PropTypes.oneOf(allowedSizes),
  onChange: PropTypes.func
};

export default TabBar;
