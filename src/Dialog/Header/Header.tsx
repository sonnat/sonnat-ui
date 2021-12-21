import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import Text from "../../Text";
import setRef from "../../utils/setRef";
import DialogContext from "../context";
import useStyles from "./styles";

interface DialogHeaderBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The title to display in the header. */
  title: string;
}

export type DialogHeaderProps = MergeElementProps<"div", DialogHeaderBaseProps>;

type Component = {
  (props: DialogHeaderProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<DialogHeaderProps> | undefined;
  displayName?: string | undefined;
};

const DialogHeaderBase = (
  props: DialogHeaderProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { className, children, title, ...otherProps } = props;

  const classes = useStyles();

  const context = React.useContext(DialogContext);

  return (
    <div
      ref={node => {
        if (ref) setRef(ref, node);
        if (node) context?.registerHeader(node);
      }}
      className={c(classes.root, className, {
        [classes.withOverflow]: context?.hasOverflow
      })}
      {...otherProps}
    >
      <Text id={context?.id} variant="subtitle">
        {title}
      </Text>
      {children}
    </div>
  );
};

const DialogHeader = React.forwardRef(DialogHeaderBase) as Component;

DialogHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.string.isRequired
};

export default DialogHeader;
