import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import { isFragment } from "react-is";
import type { MergeElementProps } from "../typings";
import useIsomorphicLayoutEffect from "../utils/useIsomorphicLayoutEffect";
import Item, { type BreadcrumbItemProps } from "./Item";
import useStyles from "./styles";

interface BreadcrumbBaseProps {
  /**
   * The content of the breadcrumb.
   *
   * The breadcrumb component only accepts `Breadcrumb/Item` component as a child.
   */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * If `true`, the breadcrumb will only show the previous step.
   *
   * It's useful when rendering on mobile devices.
   * @default false
   */
  showOnlyPreviousStep?: boolean;
}

export type BreadcrumbProps = MergeElementProps<"nav", BreadcrumbBaseProps>;

type Component = {
  (props: BreadcrumbProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<BreadcrumbProps> | undefined;
  displayName?: string | undefined;
};

const BreadcrumbBase = (
  props: BreadcrumbProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const {
    className,
    // eslint-disable-next-line react/prop-types
    "aria-label": ariaLabel = "breadcrumb",
    children: childrenProp,
    showOnlyPreviousStep = false,
    ...otherProps
  } = props;

  const classes = useStyles();

  const listRef = React.useRef<HTMLOListElement>(null);

  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) return null;

    if (isFragment(child)) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Breadcrumb component doesn't accept a Fragment as a child."
      );

      return null;
    }

    if ((child as React.ReactElement).type !== Item) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Breadcrumb component only accepts `Breadcrumb/Item` as a child."
      );

      return null;
    }

    const item = child as React.ReactElement<BreadcrumbItemProps>;

    return React.cloneElement(item, {
      className: c(item.props.className, classes.item)
    });
  });

  const getLastItem = () => {
    if (listRef.current) {
      const items = listRef.current.children;
      return items[items.length - 1];
    }

    return null;
  };

  useIsomorphicLayoutEffect(() => {
    const lastItem = getLastItem();

    if (!showOnlyPreviousStep) {
      lastItem
        ?.querySelectorAll("a")
        .forEach(link => link.setAttribute("tabindex", "-1"));
    }

    return () => {
      lastItem
        ?.querySelectorAll("a")
        .forEach(link => link.removeAttribute("tabindex"));
    };
  }, [children, showOnlyPreviousStep]);

  return (
    <nav
      aria-label={ariaLabel}
      className={c(classes.root, className)}
      ref={ref}
      {...otherProps}
    >
      <ol
        ref={listRef}
        className={c(classes.list, {
          [classes.onlyPreviousStep]: showOnlyPreviousStep
        })}
      >
        {children}
      </ol>
    </nav>
  );
};

const Breadcrumb = React.forwardRef(BreadcrumbBase) as Component;

Breadcrumb.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  showOnlyPreviousStep: PropTypes.bool
};

export default Breadcrumb;
