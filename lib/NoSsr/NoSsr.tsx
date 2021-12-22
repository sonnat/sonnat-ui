import PropTypes from "prop-types";
import * as React from "react";

export interface NoSsrProps {
  /** The content of the component. (in CSR) */
  children?: React.ReactNode;
  /** The content of the component. (in SSR) */
  fallback?: React.ReactNode;
}

const NoSsr = (props: NoSsrProps): JSX.Element => {
  const { children, fallback = null } = props;

  const [isMounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return <React.Fragment>{isMounted ? children : fallback}</React.Fragment>;
};

NoSsr.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node
};

export default NoSsr;
