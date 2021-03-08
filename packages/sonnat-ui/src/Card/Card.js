import React from "react";
import { isFragment } from "react-is";
import PropTypes from "prop-types";
import createClass from "classnames";
import { componentName as childName } from "./ActionBar";
import CardContext from "./context";
import makeStyles from "../styles/makeStyles";

const componentName = "Card";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      typography: { pxToRem, useText, fontWeight, fontFamily },
      mixins: { usePreserveAspectRatio }
    } = theme;

    return {
      root: {
        width: "100%",
        display: "flex",
        direction,
        fontFamily: fontFamily[direction],
        flexDirection: "column",
        borderRadius: pxToRem(4),
        overflow: "hidden",
        boxShadow: `0 2px 8px 0 ${
          !darkMode
            ? colors.createBlackColor({
                alpha: 0.08
              })
            : colors.createWhiteColor({
                alpha: 0.08
              })
        }, 0 4px 12px 0 ${
          !darkMode
            ? colors.createBlackColor({
                alpha: 0.04
              })
            : colors.createWhiteColor({
                alpha: 0.04
              })
        })}`,
        "& $cardBody": {
          flexDirection: "column",
          justifyContent: "center"
        }
      },
      cardBody: {
        display: "flex"
      },
      cardImage: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0",
        flexShrink: "0",
        textAlign: "center",
        "& img": {
          width: "100%",
          height: "auto"
        }
      },
      cardContent: {
        display: "flex",
        flexDirection: "column",
        flexGrow: "1",
        overflow: "hidden",
        padding: pxToRem(16)
      },
      cardTitle: {
        ...useText({
          fontSize: pxToRem(14),
          fontWeight: fontWeight.medium,
          color: colors.text.primary
        }),
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        overflow: "hidden",
        maxWidth: "100%"
      },
      cardSubtitle: {
        extend: "cardTitle",
        ...useText({
          fontSize: pxToRem(12),
          color: colors.text.secondary
        })
      },
      cardDescription: {
        ...useText({
          fontSize: pxToRem(12),
          color: colors.text.secondary
        }),
        marginTop: pxToRem(16)
      },
      cardOverlay: {
        position: "absolute",
        top: "50%",
        left: "0",
        right: "0",
        bottom: "0",
        zIndex: "0",
        opacity: "0.64",
        backgroundImage: `linear-gradient(to bottom, ${colors.transparent}, ${
          !darkMode ? colors.black : colors.white
        })`
      },
      outlined: {
        boxShadow: "none",
        border: `1px solid ${
          !darkMode
            ? colors.createBlackColor({ alpha: 0.08 })
            : colors.createWhiteColor({ alpha: 0.08 })
        }`
      },
      imageCovered: {
        position: "relative",
        "& $cardBody": usePreserveAspectRatio("4:3"),
        "& $cardImage": {
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
          position: "absolute",
          left: "0",
          top: "0"
        },
        "& $cardContent": {
          position: "absolute",
          zIndex: "2",
          right: "0",
          left: "0",
          bottom: "0"
        },
        "& $cardTitle": {
          fontSize: pxToRem(16),
          color: !darkMode ? colors.white : colors.black
        },
        "& $cardSubtitle": {
          fontSize: pxToRem(14),
          color: !darkMode ? colors.white : colors.black
        },
        "& $cardOverlay": {
          top: "24%"
        }
      },
      horizontal: {
        "& $cardBody": { flexDirection: "row", justifyContent: "flex-start" },
        "& $cardImage": {
          ...usePreserveAspectRatio("1:1"),
          overflow: "hidden",
          width: pxToRem(80),
          height: pxToRem(80),
          borderRadius: pxToRem(4),
          marginTop: pxToRem(16),
          marginBottom: pxToRem(16),
          ...(direction === "rtl"
            ? { marginRight: pxToRem(16) }
            : { marginLeft: pxToRem(16) })
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Card = React.memo(
  React.forwardRef(function Card(props, ref) {
    const {
      img,
      className,
      title,
      subtitle,
      description,
      children: childrenProp,
      horizontal = false,
      outlined = false,
      imageCovered = false,
      ...otherProps
    } = props;

    const localClass = useStyles();
    let children;

    try {
      children = React.Children.only(childrenProp);
    } catch (e) {
      children = null;
    }

    if (children) {
      if (!React.isValidElement(children)) children = null;

      if (isFragment(children)) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The Card component doesn't accept a Fragment as a child."
        );

        children = null;
      }

      if (children.type.displayName !== childName) {
        // eslint-disable-next-line no-console
        console.error(
          "Sonnat: The Card component only accepts `Card/ActionBar` component as a child."
        );

        children = null;
      }
    }

    return (
      <CardContext.Provider value={{ isImageCovered: imageCovered }}>
        <article
          className={createClass(localClass.root, className, {
            [localClass.outlined]: outlined,
            [localClass.imageCovered]: imageCovered,
            [localClass.horizontal]: horizontal
          })}
          ref={ref}
          {...otherProps}
        >
          <div className={localClass.cardBody}>
            {img &&
              (!imageCovered ? (
                <figure className={createClass(localClass.cardImage)}>
                  <img
                    className="content-in-ratio"
                    src={img}
                    alt={title || "Card's Image"}
                  />
                </figure>
              ) : (
                <figure
                  className={createClass(localClass.cardImage)}
                  style={{ backgroundImage: `url(${img})` }}
                />
              ))}
            <div className={localClass.cardContent}>
              {title && (
                <strong className={localClass.cardTitle}>{title}</strong>
              )}
              {subtitle && (
                <span className={localClass.cardSubtitle}>{subtitle}</span>
              )}
              {!imageCovered && !!description && (
                <p className={localClass.cardDescription}>{description}</p>
              )}
              {children}
              {imageCovered && <div className={localClass.cardOverlay}></div>}
            </div>
          </div>
        </article>
      </CardContext.Provider>
    );
  })
);

Card.displayName = componentName;

Card.propTypes = {
  children: PropTypes.node,
  img: PropTypes.string,
  className: PropTypes.string,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  description: PropTypes.string,
  horizontal: PropTypes.bool,
  outlined: PropTypes.bool,
  imageCovered: PropTypes.bool
};

export default Card;
