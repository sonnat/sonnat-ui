import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import getVar from "../utils/getVar";
import useStyles from "./styles";

interface CardBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The variant of the card.
   * @default "elevated"
   */
  variant?: "outlined" | "elevated";
}

export type CardProps = MergeElementProps<"div", CardBaseProps>;

type Component = {
  (props: CardProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<CardProps> | undefined;
  displayName?: string | undefined;
};

const allowedVariants = ["outlined", "elevated"] as const;

const CardBase = (props: CardProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    className,
    children,
    variant: variantProp = "elevated",
    ...otherProps
  } = props;

  const classes = useStyles();

  const variant = getVar(
    variantProp,
    "elevated",
    !allowedVariants.includes(variantProp)
  );

  return (
    <div
      ref={ref}
      className={c(classes.root, className, classes[variant])}
      {...otherProps}
    >
      {children}
    </div>
  );
};

const Card = React.forwardRef(CardBase) as Component;

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(allowedVariants)
};

export default Card;
