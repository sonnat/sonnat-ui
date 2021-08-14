import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import Button from "../Button";
import CloseLarge from "../internals/icons/CloseLarge";
import { makeStyles, ThemeProvider, useDarkMode, useTheme } from "../styles";
import onNextFrame from "../utils/onNextFrame";

const componentName = "Snackbar";

const allowedPlacements = ["left", "center", "right"];

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      darkMode,
      direction,
      zIndexes: { popover },
      mixins: { useIconWrapper },
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
        bottom: pxToRem(24),
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
        ...useIconWrapper(16),
        color: !darkMode ? colors.white : "rgba(0, 0, 0, 0.87)",
        flexShrink: 0,
        position: "relative",
        top: pxToRem(16),
        alignSelf: "flex-start",
        "& + $text": {
          ...(direction === "rtl"
            ? { marginRight: pxToRem(8) }
            : { marginLeft: pxToRem(8) })
        }
      },
      text: {
        ...useText({
          fontSize: pxToRem(14),
          lineHeight: 1.5714285714,
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
      left: { right: "auto", left: pxToRem(24) },
      right: { right: pxToRem(24), left: "auto" },
      center: {
        right: "auto",
        left: "50%",
        transform: "translateX(-50%) scale(0.8)"
      },
      open: {
        transform: "scale(1)",
        visibility: "visible",
        opacity: 1,
        "&$left": {},
        "&$right": {},
        "&$center": { transform: "translateX(-50%) scale(1)" }
      },
      hideDurationWrapper: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 3,
        opacity: 0,
        transform: "translateY(100%)",
        visibility: "hidden",
        backgroundColor: !darkMode
          ? colors.pallete.grey[900]
          : colors.pallete.grey[50]
      },
      hideDurationIndicator: {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 0,
        backgroundColor: !darkMode
          ? colors.secondary.dark
          : colors.secondary.light
      },
      autoHidable: {
        borderRadius: `${pxToRem(4)} ${pxToRem(4)} 0 0`,
        "&$open $hideDurationWrapper": {
          opacity: 1,
          visibility: "visible"
        },
        "&$open $hideDurationIndicator": {
          width: "100%"
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const Snackbar = React.memo(
  React.forwardRef(function Snackbar(props, ref) {
    const {
      text,
      className,
      icon,
      onUndo,
      onClose,
      onTransitionEnd,
      autoHide = false,
      open = false,
      undoable = false,
      closable = false,
      undoButtonLabel = "Undo",
      placement = "center",
      ...otherProps
    } = props;

    const classes = useStyles();
    const theme = useTheme();

    const isDarkMode = theme.darkMode;
    const newTheme = useDarkMode(!isDarkMode, theme);

    const timeout = React.useRef();

    const [isHidden, setHidden] = React.useState(open);
    const [isOpen, setOpen] = React.useState(false);

    const isAutoHidable = !!autoHide;
    const hasNumericAutoCloseInput = typeof autoHide === "number";

    const numWords = text.length ? text.split(" ").length : 0;

    const autoHideValue = isAutoHidable
      ? hasNumericAutoCloseInput
        ? autoHide
        : numWords * 300 + 1250
      : 0;

    React.useEffect(() => {
      if (open) {
        setHidden(false);
        onNextFrame(() => setOpen(true));

        if (autoHide) {
          timeout.current = setTimeout(() => {
            setOpen(false);
          }, autoHideValue);
        }
      } else setOpen(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
          className={clx(classes.root, classes[placement], className, {
            [classes.open]: isOpen,
            [classes.autoHidable]: hasNumericAutoCloseInput && isAutoHidable
          })}
          {...otherProps}
        >
          {hasNumericAutoCloseInput && (
            <div className={classes.hideDurationWrapper}>
              <div
                className={classes.hideDurationIndicator}
                style={{ transition: `width ${autoHideValue}ms ease` }}
              ></div>
            </div>
          )}
          {icon && <i className={classes.icon}>{icon}</i>}
          <span className={classes.text}>{text}</span>
          {undoable && (
            <React.Fragment>
              <Button
                size="small"
                variant="inlined"
                color="secondary"
                label={undoButtonLabel}
                className={classes.undoButton}
                onClick={onUndo}
              />
              {closable && <div className={classes.divider}></div>}
            </React.Fragment>
          )}
          {closable && (
            <Button
              aria-label="Close Button"
              size="small"
              variant="inlined"
              className={classes.closeButton}
              leadingIcon={<CloseLarge className={classes.closeButtonIcon} />}
              onClick={e => {
                if (timeout.current != null) clearTimeout(timeout.current);
                if (onClose) onClose(e);
              }}
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
  icon: PropTypes.node,
  undoButtonLabel: PropTypes.string,
  placement: PropTypes.oneOf(allowedPlacements),
  autoHide: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  open: PropTypes.bool,
  closable: PropTypes.bool,
  undoable: PropTypes.bool,
  onClose: PropTypes.func,
  onUndo: PropTypes.func,
  onTransitionEnd: PropTypes.func
};

export default Snackbar;
