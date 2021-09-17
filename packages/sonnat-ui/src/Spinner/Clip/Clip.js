import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../../styles/makeStyles";
import useTheme from "../../styles/useTheme";

const componentName = "ClipSpinner";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction]
      },
      svg: {
        width: "100%",
        height: "100%",
        animationName: "$rotateAnimation",
        animationDuration: "0.8s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite"
      },
      base: {
        transition: "fill 360ms ease"
      },
      movingParticle: {
        fill: "none",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: pxToRem(2),
        animationName: "$clipAnimation",
        animationDuration: "1.6s",
        animationTimingFunction: "ease-in",
        animationIterationCount: "infinite",
        transformOrigin: "center"
      },
      "@keyframes clipAnimation": {
        "0%": {
          strokeDasharray: "1, 100",
          strokeDashoffset: "0"
        },
        "50%": {
          strokeDasharray: "80, 100",
          strokeDashoffset: "46"
        },
        "100%": {
          strokeDasharray: "1, 100",
          strokeDashoffset: "0"
        }
      },
      "@keyframes rotateAnimation": {
        "100%": {
          transform: "rotate(360deg)"
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const ClipSpinner = function ClipSpinner(props) {
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
    width: pxToRem(size) || pxToRem(20),
    height: pxToRem(size) || pxToRem(20),
    minWidth: pxToRem(size) || pxToRem(20),
    minHeight: pxToRem(size) || pxToRem(20)
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
      className={clx(classes.root, className)}
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

ClipSpinner.displayName = componentName;

ClipSpinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
  backgroundColor: PropTypes.string,
  foregroundColor: PropTypes.string
};

export default ClipSpinner;
