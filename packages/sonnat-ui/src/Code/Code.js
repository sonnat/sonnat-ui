import React from "react";
import PropTypes from "prop-types";
import clx from "classnames";
import makeStyles from "../styles/makeStyles";

const componentName = "Code";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, fontWeight, useText, fontFamily }
    } = theme;

    return {
      root: {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        ...useText({
          fontSize: "0.875em",
          fontWeight: fontWeight.regular,
          lineHeight: 1.5714285714,
          color: colors.text.primary
        }),
        direction,
        fontFamily: fontFamily.monospace,
        borderRadius: pxToRem(2),
        backgroundColor: !darkMode
          ? colors.pallete.grey[100]
          : colors.pallete.grey[900],
        display: "inline-block",
        padding: `0 ${pxToRem(4)}`
      },
      codeBlock: {
        overflow: "auto",
        display: "block",
        textAlign: "left",
        direction: "ltr",
        fontSize: "0.875em",
        padding: pxToRem(16),
        backgroundColor: colors.transparent,
        border: `1px solid ${colors.divider}`,
        borderRadius: pxToRem(4)
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Code = React.memo(
  React.forwardRef(function Code(props, ref) {
    const { className, children, codeBlock = false, ...otherProps } = props;

    const classes = useStyles();

    const RootNode = codeBlock ? "pre" : "code";

    return (
      <RootNode
        ref={ref}
        className={clx(classes.root, className, {
          [classes.codeBlock]: codeBlock
        })}
        {...otherProps}
      >
        {children}
      </RootNode>
    );
  })
);

Code.displayName = componentName;

Code.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  codeBlock: PropTypes.bool
};

export default Code;
