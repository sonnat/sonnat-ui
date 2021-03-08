import React from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import makeStyles from "../styles/makeStyles";

const componentName = "Divider";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      typography: { pxToRem, fontWeight, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        position: "relative",
        margin: "0",
        border: "none",
        flexShrink: "0",
        "&:not($vertical):not($dotted)": {
          width: "100%",
          height: pxToRem(1),
          backgroundColor: colors.divider
        }
      },
      spaced: {
        "&:not($vertical)": {
          marginTop: pxToRem(16),
          marginBottom: pxToRem(16)
        },
        "&$vertical": {
          marginLeft: pxToRem(16),
          marginRight: pxToRem(16)
        }
      },
      dotted: {
        boxSizing: "content-box",
        height: "0",
        textAlign: "center",
        fontSize: pxToRem(28),
        lineHeight: "1.14285714",
        fontWeight: fontWeight.regular,
        marginTop: pxToRem(24),
        marginBottom: pxToRem(8),
        border: "none",
        "&:after": {
          content: '"..."',
          display: "inline-block",
          marginLeft: "0.6em",
          position: "relative",
          color: colors.text.primary,
          top: pxToRem(-24),
          letterSpacing: "0.6em"
        }
      },
      vertical: {
        height: "auto",
        width: pxToRem(1),
        backgroundColor: colors.divider,
        alignSelf: "stretch"
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Divider = React.memo(function Divider(props) {
  const {
    className,
    rootNode: HTMLTag = "hr",
    spaced = false,
    dotted = false,
    vertical = false,
    ...otherProps
  } = props;

  const localClass = useStyles();

  return (
    <HTMLTag
      role="separator"
      className={createClass(localClass.root, className, {
        [localClass.spaced]: spaced,
        [localClass.dotted]: dotted,
        [localClass.vertical]: vertical
      })}
      {...otherProps}
    />
  );
});

Divider.displayName = componentName;

Divider.propTypes = {
  className: PropTypes.string,
  rootNode: PropTypes.elementType,
  spaced: PropTypes.bool,
  dotted: PropTypes.bool,
  vertical: PropTypes.bool
};

export default Divider;
