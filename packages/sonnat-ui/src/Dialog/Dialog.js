import clx from "classnames";
import PropTypes from "prop-types";
import React from "react";
import PortalDestination from "../PortalDestination";
import makeStyles from "../styles/makeStyles";
import detectScrollBarWidth from "../utils/detectScrollBarWidth";
import useEventListener from "../utils/useEventListener";
import DialogContext from "./context";

const componentName = "Dialog";

/**
 *  @type {(isOverride?: string) => string}
 */
const useId = idOverride => {
  const [defaultId, setDefaultId] = React.useState(idOverride);

  const id = idOverride || defaultId;

  React.useEffect(() => {
    if (defaultId == null) {
      // Fallback to this default id when possible.
      // Use the random value for client-side rendering only.
      // We can't use it server-side.
      setDefaultId(`sonnat-${Math.round(Math.random() * 1e9)}`);
    }
  }, [defaultId]);

  return id;
};

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      direction,
      darkMode,
      zIndexes,
      typography: { pxToRem, fontFamily }
    } = theme;

    const boxShadow = {
      darkMode: [
        "0 4px 4px -4px rgba(0, 0, 0, 0.12)",
        "0 8px 10px 1px rgba(0, 0, 0, 0.08)",
        "0 4px 8px 2px rgba(0, 0, 0, 0.04)",
        "0 0 0 1px rgba(0, 0, 0, 0.12)"
      ].join(", "),
      lightMode: [
        "0 1px 6px 0 rgba(0, 0, 0, 0.04)",
        "0 -8px 32px -4px rgba(0, 0, 0, 0.08)",
        "0 16px 24px -6px rgba(0, 0, 0, 0.04)"
      ].join(", ")
    };

    return {
      root: {
        position: "absolute",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: zIndexes.modal,
        direction,
        fontFamily: fontFamily[direction],
        outline: "none",
        visibility: "hidden",
        opacity: 0,
        transition: ["opacity 360ms ease", "visibility 360ms ease"].join(", ")
      },
      backdrop: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: -1,
        outline: "none",
        backgroundColor: "rgba(0, 0, 0, 0.56)"
      },
      dialog: {
        width: "100%",
        maxWidth: pxToRem(560),
        maxHeight: "70vh",
        margin: pxToRem(32),
        position: "relative",
        borderRadius: pxToRem(4),
        boxShadow: !darkMode ? boxShadow.lightMode : boxShadow.darkMode,
        backgroundColor: !darkMode
          ? colors.background.origin
          : colors.background.level[1],
        outline: "none"
      },
      open: {
        visibility: "visible",
        opacity: 1
      },
      fullScreen: {
        "& $dialog": {
          margin: 0,
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          maxHeight: "none",
          borderRadius: 0
        }
      }
    };
  },
  { name: `Sonnat${componentName}` }
);

const isSsr = typeof window === "undefined";

const preventPageScroll = () => {
  document.body.style.overflow = "hidden";

  const hasPageOverflow = document.body.scrollHeight > window.innerHeight;

  if (hasPageOverflow)
    document.body.style.paddingRight = `${detectScrollBarWidth()}px`;
};

const allowPageScroll = () => {
  document.body.style.overflow = "";
  document.body.style.paddingRight = "";
};

/**
 * @type {(name: string, map: Map<string, HTMLDivElement>) => (node: HTMLDivElement) => void}
 */
const register = (name, map) => {
  return node => {
    map.set(name, node);
  };
};

const Dialog = React.memo(
  React.forwardRef(function Dialog(props, ref) {
    const {
      children,
      className,
      maxWidth,
      onOpen,
      onClose,
      onBackdropClick,
      onEscapeKeyUp,
      "aria-describedby": ariaDescribedBy,
      "aria-labelledby": ariaLabelledByProp,
      fullScreen: isFullScreen = false,
      open: openState = false,
      ...otherProps
    } = props;

    const classes = useStyles();

    const nodesMap = new Map();

    const [state, setState] = React.useState({
      hasOverflow: false,
      bodyHeight: 0
    });

    const dialogRef = React.useRef();
    const ariaLabelledby = useId(ariaLabelledByProp);

    const getStatus = () => {
      if (dialogRef.current && openState) {
        let headerHeight = 0;
        let actionBarHeight = 0;

        const header = nodesMap.get("header");
        const actionBar = nodesMap.get("actionBar");
        const body = nodesMap.get("body");

        if (body) {
          const currentHeight = body.style.height;

          if (header) headerHeight = header.offsetHeight;
          if (actionBar) actionBarHeight = actionBar.offsetHeight;

          body.style.height = "";
          const rootHeight = dialogRef.current.offsetHeight;
          const rootScrollHeight = dialogRef.current.scrollHeight;
          body.style.height = currentHeight;

          const newHeight = rootHeight - (headerHeight + actionBarHeight);

          return {
            bodyHeight: newHeight,
            hasOverflow: rootScrollHeight > rootHeight
          };
        }

        return null;
      }
    };

    React.useEffect(() => {
      if (openState) {
        if (onOpen) onOpen();
        preventPageScroll();

        const status = getStatus();

        if (status) {
          setState({
            bodyHeight: status.bodyHeight,
            hasOverflow: status.hasOverflow
          });
        }
      } else {
        if (onClose) onClose();
        allowPageScroll();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [openState, onOpen, onClose]);

    const backdropClickHandler = e => {
      if (onBackdropClick) onBackdropClick(e);
    };

    const escapeKeyUpHandler = e => {
      if (e.key.toLowerCase() === "escape" || e.key.toLowerCase() === "esc") {
        if (onEscapeKeyUp) onEscapeKeyUp(e);
      }
    };

    if (!isSsr) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      useEventListener(
        {
          element: document,
          eventName: "keyup",
          listener: escapeKeyUpHandler
        },
        openState && onEscapeKeyUp != null
      );
    }

    return (
      <PortalDestination aria-hidden={!openState}>
        <div
          tabIndex={-1}
          ref={ref}
          className={clx(classes.root, className, {
            [classes.fullScreen]: isFullScreen,
            [classes.open]: openState
          })}
          {...otherProps}
        >
          <div
            aria-hidden="true"
            className={classes.backdrop}
            onClick={backdropClickHandler}
          ></div>
          <div
            aria-describedby={ariaDescribedBy}
            aria-labelledby={ariaLabelledby}
            role="dialog"
            ref={dialogRef}
            className={classes.dialog}
            style={{ maxWidth }}
          >
            <DialogContext.Provider
              value={{
                nodesMap,
                registerHeader: register("header", nodesMap),
                registerBody: register("body", nodesMap),
                registerActionBar: register("actionBar", nodesMap),
                id: ariaLabelledby,
                hasOverflow: state.hasOverflow,
                bodyHeight: state.bodyHeight
              }}
            >
              {children}
            </DialogContext.Provider>
          </div>
        </div>
      </PortalDestination>
    );
  })
);

Dialog.displayName = componentName;

Dialog.propTypes = {
  "aria-describedby": PropTypes.string,
  "aria-labelledby": PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  maxWidth: PropTypes.number,
  open: PropTypes.bool,
  fullScreen: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  onBackdropClick: PropTypes.func,
  onEscapeKeyUp: PropTypes.func
};

export default Dialog;
