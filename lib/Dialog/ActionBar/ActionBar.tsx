import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import setRef from "../../utils/setRef";
import DialogContext from "../context";
import useStyles from "./styles";

interface DialogActionBarBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type DialogActionBarProps = MergeElementProps<
  "div",
  DialogActionBarBaseProps
>;

type Component = {
  (props: DialogActionBarProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<DialogActionBarProps> | undefined;
  displayName?: string | undefined;
};

const DialogActionBarBase = (
  props: DialogActionBarProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { className, children, ...otherProps } = props;

  const classes = useStyles();
  const context = React.useContext(DialogContext);

  return (
    <div
      ref={node => {
        if (ref) setRef(ref, node);
        if (node) context?.registerActionBar(node);
      }}
      className={c(classes.root, className, {
        [classes.withOverflow]: context?.hasOverflow
      })}
      {...otherProps}
    >
      {children}
    </div>
  );
};

const DialogActionBar = React.forwardRef(DialogActionBarBase) as Component;

DialogActionBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default DialogActionBar;
