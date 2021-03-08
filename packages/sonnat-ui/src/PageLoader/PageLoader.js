import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";

const componentName = "PageLoader";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      zIndexes,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: zIndexes.header,
        opacity: 0,
        visibility: "hidden",
        transition: "opacity 360ms ease, visibility 360ms ease"
      },
      progress: {
        position: "absolute",
        zIndex: 2,
        top: 0,
        left: 0,
        height: pxToRem(4),
        backgroundColor: !darkMode
          ? colors.primary.origin
          : colors.primary.light,
        transition: "width 360ms ease"
      },
      overlay: {
        position: "absolute",
        zIndex: 1,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: darkMode
          ? "rgba(0, 0, 0, 0.56)"
          : "rgba(255, 255, 255, 0.7)"
      },
      visible: { opacity: 1, visibility: "visible" }
    };
  },
  { name: `Sonnat${componentName}` }
);

const PageLoader = React.memo(function PageLoader(props) {
  const { className, loading = false, top = 0, ...otherProps } = props;

  const localClass = useStyles();

  const step = useRef(0);
  const timeout = useRef(-1);
  const task = useRef(-1);

  const isInit = useRef(false);

  const [width, setWidth] = useState(0);
  const [stepValue, setStepValue] = useState(0.05);
  const [visible, setVisible] = useState(false);

  const createProgressTask = () => {
    const task = () => {
      let newWidth = 0;

      step.current += stepValue;

      newWidth =
        Math.round((Math.atan(step.current) / (Math.PI / 2)) * 100 * 1000) /
        1000;
      setWidth(newWidth);

      if (newWidth >= 100) clearInterval(task.current);
      else if (newWidth >= 60) setStepValue(0.005);
    };

    return setInterval(task, 100);
  };

  useEffect(() => {
    if (loading && !isInit.current) {
      step.current = 0;

      setVisible(true);
      isInit.current = true;

      task.current = createProgressTask();
    } else if (!loading && isInit.current) {
      clearInterval(task.current);
      setWidth(100);
      setStepValue(0.05);
      setVisible(false);

      isInit.current = false;
      timeout.current = setTimeout(() => {
        setWidth(0);
      }, 400);
    }

    return () => {
      clearInterval(task.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div
      style={{ top }}
      className={createClass(className, localClass.root, {
        [localClass.visible]: visible
      })}
      {...otherProps}
    >
      <div className={localClass.progress} style={{ width: `${width}%` }}></div>
      <div className={localClass.overlay}></div>
    </div>
  );
});

PageLoader.displayName = componentName;

PageLoader.propTypes = {
  top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default PageLoader;
