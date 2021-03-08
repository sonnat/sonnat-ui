import React, { useContext } from "react";
import { isFragment } from "react-is";
import PropTypes from "prop-types";
import createClass from "classnames";
import CardContext from "../context";
import { componentName as childName } from "../Action";
import makeStyles from "../../styles/makeStyles";

export const componentName = "CardActionBar";

const useStyles = makeStyles(
  theme => {
    const {
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
        marginRight: pxToRem(-16),
        marginLeft: pxToRem(-16),
        marginBottom: pxToRem(-16),
        padding: pxToRem(8)
      },
      imageCovered: ({ isImageCovered }) => {
        return isImageCovered
          ? {
              marginTop: "0",
              zIndex: "3"
            }
          : {};
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const CardActionBar = React.memo(
  React.forwardRef(function CardActionBar(props, ref) {
    const { children: childrenProp, className, ...otherProps } = props;

    const { isImageCovered } = useContext(CardContext);
    const localClass = useStyles({ isImageCovered });

    const children = React.Children.map(childrenProp, child => {
      if (!React.isValidElement(child)) return null;

      if (isFragment(child)) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The CardActionBar component doesn't accept a Fragment as a child."
        );

        return null;
      }

      if (child.type.displayName !== childName) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The CardActionBar component only accepts `Card/Action` as a child."
        );

        return null;
      }
    });

    return (
      <div
        ref={ref}
        className={createClass(
          localClass.root,
          { [localClass.imageCovered]: isImageCovered },
          className
        )}
        {...otherProps}
      >
        {children}
      </div>
    );
  })
);

CardActionBar.displayName = componentName;

CardActionBar.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default CardActionBar;
