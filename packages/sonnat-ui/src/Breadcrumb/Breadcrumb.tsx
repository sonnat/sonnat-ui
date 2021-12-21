import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import { isFragment } from "react-is";
import type { MergeElementProps } from "../typings";
import Item, { BreadcrumbItemProps } from "./Item";
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

  const children = React.Children.map(childrenProp, child => {
    if (!React.isValidElement(child)) return null;

    if (isFragment(child)) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Breadcrumb component doesn't accept a Fragment as a child."
      );
    }

    if (child.type !== Item) {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The Breadcrumb component only accepts `Breadcrumb/Item` as a child."
      );
    }

    return React.cloneElement(child, {
      className: c((child.props as BreadcrumbItemProps).className, classes.item)
    });
  });

  return (
    <nav
      aria-label={ariaLabel}
      className={c(classes.root, className)}
      ref={ref}
      {...otherProps}
    >
      <ol
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
