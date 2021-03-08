import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

const componentName = "NoSsr";

const NoSsr = React.memo(function NoSsr({ children, fallback = null }) {
  const [isMounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  return <React.Fragment>{isMounted ? children : fallback}</React.Fragment>;
});

NoSsr.displayName = componentName;

NoSsr.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node
};

export default NoSsr;
