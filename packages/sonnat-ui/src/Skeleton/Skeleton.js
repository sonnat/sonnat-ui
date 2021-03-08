// The API is inspired by Material-UI's Skeleton

import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";

const componentName = "Skeleton";
const allowedVariants = ["circular", "rectangular", "text"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        display: "block",
        backgroundColor: !darkMode
          ? colors.createBlackColor({ alpha: 0.12 })
          : colors.createWhiteColor({ alpha: 0.12 }),
        height: "1.2em",
        animation: "$pulse 1.5s ease-in-out 0.5s infinite"
      },
      text: {
        marginTop: 0,
        marginBottom: 0,
        height: "auto",
        transformOrigin: "0 55%",
        transform: "scale(1, 0.60)",
        borderRadius: pxToRem(4),
        "&:empty:before": {
          content: '"\\00a0"'
        }
      },
      circular: {
        borderRadius: "50%"
      },
      rectangular: { borderRadius: pxToRem(4) },
      autoHeight: {
        height: "auto"
      },
      autoWidth: {
        maxWidth: "fit-content"
      },
      hasChildren: {
        "& > *": {
          visibility: "hidden"
        }
      },
      "@keyframes pulse": {
        "0%": {
          opacity: 1
        },
        "50%": {
          opacity: 0.4
        },
        "100%": {
          opacity: 1
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Skeleton = React.memo(
  React.forwardRef(function Skeleton(props, ref) {
    const {
      children,
      className,
      ratio,
      width,
      height,
      style: styleProp = {},
      rootNode: HTMLTag = "span",
      variant = "text",
      ...otherProps
    } = props;

    const localClass = useStyles();

    // eslint-disable-next-line no-unused-vars
    const { width: _w, height: _h, ...otherStyleProps } = styleProp;
    const style = { width, height, ...otherStyleProps };

    if (ratio && variant === "rectangular") {
      style.height = 0;
      style.paddingTop = `${100 / ratio}%`;
    } else if (ratio && variant !== "rectangular") {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.error(
          `Sonnat: You can not use the \`ratio={${ratio}}\` and \`variant="${variant}"\` properties ` +
            "at the same time on a `Skeleton` component."
        );
      }
    }

    return (
      <HTMLTag
        ref={ref}
        style={style}
        className={createClass(localClass.root, className, {
          [localClass[variant]]: allowedVariants.includes(variant),
          [localClass.autoHeight]: !!children && !height,
          [localClass.autoWidth]: !!children && !width,
          [localClass.hasChildren]: !!children
        })}
        {...otherProps}
      >
        {children}
      </HTMLTag>
    );
  })
);

Skeleton.displayName = componentName;

Skeleton.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  rootNode: PropTypes.elementType,
  style: PropTypes.object,
  ratio: PropTypes.number,
  variant: PropTypes.oneOf(allowedVariants),
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default Skeleton;
