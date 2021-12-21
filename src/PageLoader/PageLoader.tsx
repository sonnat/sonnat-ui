import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import type { MergeElementProps } from "../typings";
import useStyles from "./styles";

interface PageLoaderBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The value of the `top` CSSProperty.
   * It will indicate the component's distance from top.
   */
  top?: number | string;
  /**
   * If `true`, the component will indicate the loading progress.
   * @default false
   */
  loading?: boolean;
}

export type PageLoaderProps = MergeElementProps<"div", PageLoaderBaseProps>;

type Component = {
  (props: PageLoaderProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<PageLoaderProps> | undefined;
  displayName?: string | undefined;
};

const PageLoaderBase = (props: PageLoaderProps) => {
  const { className, loading = false, top = 0, ...otherProps } = props;

  const classes = useStyles();

  const step = React.useRef(0);
  const timeout = React.useRef(-1);
  const taskInterval = React.useRef(-1);

  const isInit = React.useRef(false);

  const [width, setWidth] = React.useState(0);
  const [stepValue, setStepValue] = React.useState(0.05);
  const [visible, setVisible] = React.useState(false);

  const createProgressTask = () => {
    const task = () => {
      let newWidth = 0;

      step.current += stepValue;

      newWidth =
        Math.round((Math.atan(step.current) / (Math.PI / 2)) * 100 * 1000) /
        1000;
      setWidth(newWidth);

      if (newWidth >= 100) clearInterval(taskInterval.current);
      else if (newWidth >= 60) setStepValue(0.005);
    };

    return window.setInterval(task, 100);
  };

  React.useEffect(() => {
    if (loading && !isInit.current) {
      step.current = 0;

      setVisible(true);
      isInit.current = true;

      taskInterval.current = createProgressTask();
    } else if (!loading && isInit.current) {
      clearInterval(taskInterval.current);
      setWidth(100);
      setStepValue(0.05);
      setVisible(false);

      isInit.current = false;
      timeout.current = window.setTimeout(() => {
        setWidth(0);
      }, 400);
    }

    return () => {
      clearInterval(taskInterval.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div
      style={{ top }}
      className={c(className, classes.root, {
        [classes.visible]: visible
      })}
      {...otherProps}
    >
      <div className={classes.progress} style={{ width: `${width}%` }}></div>
      <div className={classes.overlay}></div>
    </div>
  );
};

const PageLoader = PageLoaderBase as Component;

PageLoader.propTypes = {
  top: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  loading: PropTypes.bool,
  className: PropTypes.string
};

export default PageLoader;
