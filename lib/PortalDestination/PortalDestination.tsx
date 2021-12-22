import PropTypes from "prop-types";
import * as React from "react";
import Portal from "../Portal";
import type { MergeElementProps } from "../typings";
import useStyles from "./styles";

interface BaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
}

export type PortalDestinationProps = MergeElementProps<"div", BaseProps>;

type Component = {
  (props: PortalDestinationProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<PortalDestinationProps> | undefined;
  displayName?: string | undefined;
};

const PortalDestinationBase = (
  props: PortalDestinationProps,
  ref: React.Ref<HTMLDivElement>
) => {
  const { children, ...otherProps } = props;

  const classes = useStyles();

  return (
    <Portal>
      <div
        ref={ref}
        className={classes.root}
        role="presentation"
        {...otherProps}
      >
        {children}
      </div>
    </Portal>
  );
};

const PortalDestination = React.forwardRef(PortalDestinationBase) as Component;

PortalDestination.propTypes = {
  children: PropTypes.node
};

export default PortalDestination;
