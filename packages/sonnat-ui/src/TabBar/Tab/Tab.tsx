import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import {
  useEventCallback,
  useForkedRefs,
  useIsFocusVisible
} from "../../utils";
import TabBarContext from "../context";
import useStyles from "./styles";

interface TabBaseProps {
  /** The label of the tab. */
  label?: string;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The leading icon element placed before the label.
   */
  icon?: React.ReactNode;
  /**
   * A unique identifier for the tab.
   * If not provided the index of the tab (which is zero-base)
   * will be considered as the identifier.
   */
  identifier?: number | string;
  /**
   * If `true`, the tab will be active (selected).
   * @default false
   */
  active?: boolean;
  /**
   * The Callback fires when the tab has been clicked.
   */
  onClick?: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    identifier: number | string
  ) => void;
}

export type TabProps = MergeElementProps<"div", TabBaseProps>;

type Component = {
  (props: TabProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<TabProps> | undefined;
  displayName?: string | undefined;
};

const TabBase = (props: TabProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className,
    label,
    icon,
    onClick,
    onFocus,
    onBlur,
    onKeyDown,
    active,
    identifier,
    ...otherProps
  } = props;

  const classes = useStyles();

  const hasLeadingIcon = icon != null && icon;
  const isIconTab = label == null || label.length === 0;

  const context = React.useContext(TabBarContext);

  const {
    isFocusVisibleRef,
    onBlur: handleBlurVisible,
    onFocus: handleFocusVisible,
    ref: focusVisibleRef
  } = useIsFocusVisible<HTMLDivElement>();

  const tabRef = React.useRef<HTMLDivElement>();
  const handleRef = useForkedRefs(ref, focusVisibleRef, tabRef);

  const [focusVisible, setFocusVisible] = React.useState(false);

  if (!active && focusVisible) setFocusVisible(false);

  React.useEffect(() => {
    isFocusVisibleRef.current = focusVisible;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusVisible]);

  const handleFocus = useEventCallback(
    (event: React.FocusEvent<HTMLDivElement>) => {
      // Fix for https://github.com/facebook/react/issues/7769
      if (!tabRef.current) tabRef.current = event.currentTarget;

      handleFocusVisible(event);

      if (isFocusVisibleRef.current === true) setFocusVisible(true);
      if (onFocus) onFocus(event);
    }
  );

  const handleBlur = useEventCallback(event => {
    handleBlurVisible(event);

    if (isFocusVisibleRef.current === false) setFocusVisible(false);
    if (onBlur) onBlur(event);
  });

  const handleKeyDown = useEventCallback(event => {
    if (onKeyDown) onKeyDown(event);

    if (
      event.target === event.currentTarget &&
      (event.key === "Left" || event.key === "ArrowLeft") &&
      active
    ) {
      event.preventDefault();

      context &&
        (context.isRtl
          ? context.focusRightAdjacentTab(identifier!)
          : context.focusLeftAdjacentTab(identifier!));
    }

    if (
      event.target === event.currentTarget &&
      (event.key === "Right" || event.key === "ArrowRight") &&
      active
    ) {
      event.preventDefault();

      context &&
        (context.isRtl
          ? context.focusLeftAdjacentTab(identifier!)
          : context.focusRightAdjacentTab(identifier!));
    }
  });

  return (
    <div
      role="tab"
      ref={handleRef}
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onClick={e => {
        if (!active) {
          if (context?.onChange) context.onChange(identifier!);
          if (onClick) onClick(e, identifier!);
        }
      }}
      className={c(
        classes.root,
        className,
        !!context?.size && classes[context.size],
        {
          [classes.active]: active,
          [classes.fluid]: context?.fluid,
          [classes.stable]: !context?.scrollable,
          [classes.leadingIconed]: hasLeadingIcon,
          [classes.iconTab]: isIconTab,
          [classes.focusVisible]: focusVisible
        }
      )}
      {...otherProps}
    >
      <div className={classes.content}>
        {icon && <i className={classes.icon}>{icon}</i>}
        {label && <span className={classes.label}>{label}</span>}
      </div>
    </div>
  );
};

const Tab = React.forwardRef(TabBase) as Component;

Tab.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.node,
  active: PropTypes.bool,
  onClick: PropTypes.func,
  onKeyDown: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  identifier: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default Tab;
