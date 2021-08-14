import PropTypes from "prop-types";
import React from "react";

const componentName = "NoSsr";

const NoSsr = React.memo(function NoSsr({ children, fallback = null }) {
  const [isMounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  return <React.Fragment>{isMounted ? children : fallback}</React.Fragment>;
});

NoSsr.displayName = componentName;

NoSsr.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node
};

export default NoSsr;
