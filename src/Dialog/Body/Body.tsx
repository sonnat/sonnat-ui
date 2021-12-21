import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../../typings";
import setRef from "../../utils/setRef";
import DialogContext from "../context";
import useStyles from "./styles";

interface DialogBodyBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
}

export type DialogBodyProps = MergeElementProps<"div", DialogBodyBaseProps>;

type Component = {
  (props: DialogBodyProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<DialogBodyProps> | undefined;
  displayName?: string | undefined;
};

const DialogBodyBase = (
  props: DialogBodyProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { className, children, style = {}, ...otherProps } = props;
  const { height: heightStyle, ...styles } = style;

  const classes = useStyles();
  const context = React.useContext(DialogContext);

  const height = context?.bodyHeight || heightStyle || "auto";

  return (
    <div
      ref={node => {
        if (ref) setRef(ref, node);
        if (node) context?.registerBody(node);
      }}
      style={{ ...styles, height }}
      className={c(classes.root, className, {
        [classes.withOverflow]: context?.hasOverflow
      })}
      {...otherProps}
    >
      {children}
    </div>
  );
};
const DialogBody = React.forwardRef(DialogBodyBase) as Component;

DialogBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object
};

export default DialogBody;
