import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import useTheme from "../../styles/useTheme";
import type { MergeElementProps } from "../../typings";
import useStyles from "./styles";

interface ClipBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Sets the backgroundColor of the Spinner.
   */
  backgroundColor?: string;
  /**
   * Sets the foregroundColor (color of the strokes) of the Spinner.
   */
  foregroundColor?: string;
  /**
   * The size of the Spinner in pixels.
   */
  size?: number;
}

export type ClipSpinnerProps = MergeElementProps<"div", ClipBaseProps>;

type Component = {
  (props: ClipSpinnerProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<ClipSpinnerProps> | undefined;
  displayName?: string | undefined;
};

const ClipSpinnerBase = (props: ClipSpinnerProps) => {
  const {
    className,
    size,
    backgroundColor,
    foregroundColor,
    style,
    ...otherProps
  } = props;

  const {
    colors,
    darkMode,
    typography: { pxToRem }
  } = useTheme();

  const classes = useStyles();

  const sizing = {
    width: (size && pxToRem(size)) || pxToRem(20),
    height: (size && pxToRem(size)) || pxToRem(20),
    minWidth: (size && pxToRem(size)) || pxToRem(20),
    minHeight: (size && pxToRem(size)) || pxToRem(20)
  };

  const coloring = {
    background: backgroundColor || colors.divider,
    foreground:
      foregroundColor ||
      (!darkMode
        ? colors.createBlackColor({ alpha: 0.48 })
        : colors.createWhiteColor({ alpha: 0.48 }))
  };

  return (
    <div
      className={c(classes.root, className)}
      style={{ ...style, ...sizing }}
      {...otherProps}
    >
      <svg
        className={classes.svg}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
      >
        <path
          fill={coloring.background}
          className={classes.base}
          d="M8,16a8,8,0,1,1,8-8A8,8,0,0,1,8,16ZM8,2a6,6,0,1,0,6,6A6,6,0,0,0,8,2Z"
        ></path>
        <circle
          stroke={coloring.foreground}
          className={classes.movingParticle}
          cx="8"
          cy="8"
          r="7"
        ></circle>
      </svg>
    </div>
  );
};

const ClipSpinner = ClipSpinnerBase as Component;

ClipSpinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
  backgroundColor: PropTypes.string,
  foregroundColor: PropTypes.string
};

export default ClipSpinner;
