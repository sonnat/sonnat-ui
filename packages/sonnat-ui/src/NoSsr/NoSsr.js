import PropTypes from "prop-types";
import React from "react";
import useIsMounted from "../utils/useIsMounted";

const componentName = "NoSsr";

const NoSsr = React.memo(function NoSsr({ children, fallback = null }) {
  const isMountedRef = useIsMounted();

  return (
    <React.Fragment>
      {isMountedRef.current ? children : fallback}
    </React.Fragment>
  );
});

NoSsr.displayName = componentName;

NoSsr.propTypes = {
  children: PropTypes.node,
  fallback: PropTypes.node
};

export default NoSsr;
