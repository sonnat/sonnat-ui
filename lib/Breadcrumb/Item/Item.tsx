import c from "classnames";
import PropTypes from "prop-types";
import React from "react";
import { ChevronLeft, ChevronRight } from "../../internals/icons";
import useTheme from "../../styles/useTheme";
import type { MergeElementProps } from "../../typings";
import useStyles from "./styles";

interface BreadcrumbItemBaseProps {
  /**
   * The content of the breadcrumb item.
   */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type BreadcrumbItemProps = MergeElementProps<
  "li",
  BreadcrumbItemBaseProps
>;

type Component = {
  (props: BreadcrumbItemProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<BreadcrumbItemProps> | undefined;
  displayName?: string | undefined;
};

const BreadcrumbItemBase = (
  props: BreadcrumbItemProps,
  ref: React.Ref<HTMLLIElement>
) => {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();
  const theme = useTheme();

  const isRtl = theme.direction === "rtl";

  return (
    <li ref={ref} className={c(classes.root, className)} {...otherProps}>
      <div className={classes.content}>{children}</div>
      <i role="separator" className={classes.separator}>
        {isRtl ? <ChevronLeft /> : <ChevronRight />}
      </i>
    </li>
  );
};

const BreadcrumbItem = React.forwardRef(BreadcrumbItemBase) as Component;

BreadcrumbItem.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default BreadcrumbItem;
