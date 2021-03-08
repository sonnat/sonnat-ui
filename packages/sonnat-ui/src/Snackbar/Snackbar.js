import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import createClass from "classnames";
import Button from "../Button";
import Icon from "../Icon";
import onNextFrame from "../utils/onNextFrame";
import { makeStyles, useTheme, useDarkMode, ThemeProvider } from "../styles";

const componentName = "Snackbar";

const allowedHorizontalPositions = ["left", "center", "right"];
const allowedVerticalPositions = ["top", "bottom"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      zIndexes: { popover },
      mixins: { useFontIconSize },
      typography: { pxToRem, useText, fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        minHeight: pxToRem(48),
        maxWidth: pxToRem(560),
        display: "inline-flex",
        alignItems: "center",
        padding: `0 ${pxToRem(16)}`,
        borderRadius: pxToRem(4),
        boxShadow: `0 1px 32px 0 rgba(0, 0, 0, 0.08),
        0 12px 16px 0 rgba(0, 0, 0, 0.12),
        0 8px 12px -6px rgba(0, 0, 0, 0.16)`,
        backgroundColor: !darkMode
          ? colors.pallete.grey[900]
          : colors.pallete.grey[50],
        zIndex: popover,
        position: "fixed",
        "& > :last-child$divider": { display: "none" },
        "& > :last-child$undoButton": {
          ...(direction === "rtl"
            ? { marginLeft: pxToRem(-8) }
            : { marginRight: pxToRem(-8) })
        },
        visibility: "hidden",
        opacity: 0,
        transform: "scale(0.8)",
        transition:
          "transform 360ms cubic-bezier(0, 0, 0.2, 1), visibility 200ms ease, opacity 200ms ease"
      },
      icon: {
        ...useFontIconSize(16),
        color: !darkMode ? colors.white : "rgba(0, 0, 0, 0.87)",
        flexShrink: 0,
        position: "relative",
        top: pxToRem(16),
        alignSelft: "flex-start",
        "& + $text": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(8) }
            : { marginLeft: pxToRem(8) })
        }
      },
      text: {
        ...useText({
          fontSize: pxToRem(14),
          color: !darkMode ? colors.white : "rgba(0, 0, 0, 0.87)"
        }),
        padding: `${pxToRem(10)} 0`,
        "& + $divider": { display: "none" },
        "& + *": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(16) }
            : { marginLeft: pxToRem(16) })
        }
      },
      undoButton: {
        alignSelf: "flex-start",
        flexShrink: "0",
        position: "relative",
        top: pxToRem(8)
      },
      closeButton: {
        ...(direction === "rtl"
          ? { marginLeft: pxToRem(-8) }
          : { marginRight: pxToRem(-8) }),
        alignSelf: "flex-start",
        flexShrink: "0",
        position: "relative",
        top: pxToRem(8)
      },
      closeButtonIcon: {},
      divider: {
        width: pxToRem(1),
        backgroundColor: !darkMode
          ? colors.createWhiteColor({ alpha: 0.12 })
          : colors.createBlackColor({ alpha: 0.12 }),
        margin: `0 ${pxToRem(8)}`,
        alignSelf: "flex-start",
        height: pxToRem(24),
        position: "relative",
        top: pxToRem(12),
        flexShrink: "0"
      },
      open: {
        transform: "scale(1)",
        visibility: "visible",
        opacity: 1,
        "&$topLeft": {},
        "&$topRight": {},
        "&$topCenter": { transform: "translateX(-50%) scale(1)" },
        "&$bottomLeft": {},
        "&$bottomRight": {},
        "&$bottomCenter": { transform: "translateX(-50%) scale(1)" }
      },
      topLeft: { top: pxToRem(24), right: "auto", left: pxToRem(24) },
      topRight: { top: pxToRem(24), right: pxToRem(24), left: "auto" },
      topCenter: {
        top: pxToRem(24),
        right: "auto",
        left: "50%",
        transform: "translateX(-50%) scale(0.8)"
      },
      bottomLeft: { bottom: pxToRem(24), right: "auto", left: pxToRem(24) },
      bottomRight: { bottom: pxToRem(24), right: pxToRem(24), left: "auto" },
      bottomCenter: {
        bottom: pxToRem(24),
        right: "auto",
        left: "50%",
        transform: "translateX(-50%) scale(0.8)"
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const camelCase = s => s.replace(/-./g, x => x.toUpperCase()[1]);

const Snackbar = React.memo(
  React.forwardRef(function Snackbar(props, ref) {
    const {
      text,
      className,
      icon,
      onUndo,
      onClose,
      onTransitionEnd,
      open = false,
      undoable = false,
      closable = false,
      undoButtonLabel = "Undo",
      horizontalPosition = "center",
      verticalPosition = "bottom",
      ...otherProps
    } = props;

    const localClass = useStyles();
    const theme = useTheme();

    const isDarkMode = theme.darkMode;
    const newTheme = useDarkMode(theme, !isDarkMode);

    const [isHidden, setHidden] = useState(open);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
      if (open) {
        setHidden(false);
        onNextFrame(() => setOpen(true));
      } else setOpen(false);
    }, [open]);

    const transitionEndHandler = e => {
      if (onTransitionEnd) onTransitionEnd(e);
      if (!isOpen) setHidden(true);
    };

    return !isHidden ? (
      <ThemeProvider theme={newTheme}>
        <div
          ref={ref}
          role="alert"
          onTransitionEnd={transitionEndHandler}
          className={createClass(
            localClass.root,
            localClass[camelCase(`${verticalPosition}-${horizontalPosition}`)],
            className,
            { [localClass.open]: isOpen }
          )}
          {...otherProps}
        >
          {icon && <Icon identifier={icon} className={localClass.icon} />}
          <span className={localClass.text}>{text}</span>
          {undoable && (
            <React.Fragment>
              <Button
                size="small"
                variant="inlined"
                color="secondary"
                label={undoButtonLabel}
                className={localClass.undoButton}
                onClick={onUndo}
              />
              {closable && <div className={localClass.divider}></div>}
            </React.Fragment>
          )}
          {closable && (
            <Button
              aria-label="Close Button"
              size="small"
              variant="inlined"
              className={localClass.closeButton}
              leadingIcon={
                <Icon
                  identifier="close-large"
                  className={localClass.closeButtonIcon}
                />
              }
              onClick={onClose}
            />
          )}
        </div>
      </ThemeProvider>
    ) : null;
  })
);

Snackbar.displayName = componentName;

Snackbar.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  icon: PropTypes.string,
  undoButtonLabel: PropTypes.string,
  horizontalPosition: PropTypes.oneOf(allowedHorizontalPositions),
  verticalPosition: PropTypes.oneOf(allowedVerticalPositions),
  open: PropTypes.bool,
  closable: PropTypes.bool,
  undoable: PropTypes.bool,
  onClose: PropTypes.func,
  onUndo: PropTypes.func,
  onTransitionEnd: PropTypes.func
};

export default Snackbar;
