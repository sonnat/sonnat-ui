import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../../styles/makeStyles";

const componentName = "MoonSpinner";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: ({ size }) => ({
        direction,
        fontFamily: fontFamily[direction],
        width: pxToRem(size) || pxToRem(20),
        height: pxToRem(size) || pxToRem(20),
        minWidth: pxToRem(size) || pxToRem(20),
        minHeight: pxToRem(size) || pxToRem(20),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative"
      }),
      base: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        border: ({ backgroundColor }) =>
          `${pxToRem(4)} solid ${backgroundColor || colors.divider}`,
        animationName: "$rotateAnimation",
        animationDuration: "600ms",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        "&:after": {
          content: '""',
          position: "absolute",
          top: "0",
          width: pxToRem(4),
          height: pxToRem(4),
          transform: "translateY(-100%)",
          backgroundColor: ({ foregroundColor }) =>
            foregroundColor || !darkMode
              ? colors.createBlackColor({ alpha: 0.48 })
              : colors.createWhiteColor({ alpha: 0.48 }),
          borderRadius: "50%"
        }
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
    ...otherProps
  } = props;

  const localClass = useStyles({ size, backgroundColor, foregroundColor });

  return (
    <div className={createClass(localClass.root, className)} {...otherProps}>
      <div className={localClass.base}></div>
    </div>
  );
});

MoonSpinner.displayName = componentName;

MoonSpinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  backgroundColor: PropTypes.string,
  foregroundColor: PropTypes.string
};

export default MoonSpinner;
