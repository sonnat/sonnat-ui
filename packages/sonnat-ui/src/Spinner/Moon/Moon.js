import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../../styles/makeStyles";
import useTheme from "../../styles/useTheme";

const componentName = "MoonSpinner";

const useStyles = makeStyles(
  theme => {
    const {
      direction,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      },
      base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        animationName: "$rotateAnimation",
        animationDuration: "600ms",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite"
      },
      movingParticle: {
        position: "absolute",
        top: "0",
        width: pxToRem(4),
        height: pxToRem(4),
        transform: "translateY(-100%)",
        borderRadius: "50%"
      },
      "@keyframes rotateAnimation": {
        "0%": {
          transform: "rotate(0)"
        },
        "100%": {
          transform: "rotate(360deg)"
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const MoonSpinner = React.memo(function MoonSpinner(props) {
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
      <div
        className={classes.base}
        style={{ border: `${pxToRem(4)} solid ${coloring.background}` }}
      >
        <div
          className={classes.movingParticle}
          style={{ backgroundColor: coloring.foreground }}
        />
      </div>
    </div>
  );
});

MoonSpinner.displayName = componentName;

MoonSpinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
  backgroundColor: PropTypes.string,
  foregroundColor: PropTypes.string
};

export default MoonSpinner;
