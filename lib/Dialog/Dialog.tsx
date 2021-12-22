import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import PortalDestination from "../PortalDestination";
import type { MergeElementProps } from "../typings";
import { detectScrollBarWidth, useEventListener, useId } from "../utils";
import DialogContext from "./context";
import useStyles from "./styles";

interface DialogBaseProps {
  /** The content of the component. */
  children?: React.ReactNode;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * A number in pixels which determines the `max-width` of the dialog.
   */
  maxWidth?: number;
  /**
   * If `true`, the dialog will be full-screen.
   * @default false
   */
  fullScreen?: boolean;
  /**
   * If `true`, the dialog will be open.
   * @default false
   */
  open?: boolean;
  /** The Callback fires when the dialog has opened. */
  onOpen?: () => void;
  /** The Callback fires when the dialog has closed. */
  onClose?: () => void;
  /** Callback fired when the backdrop is clicked. */
  onBackdropClick?: React.MouseEventHandler<HTMLDivElement>;
  /** Callback fired when the `Escape` key is released. */
  onEscapeKeyUp?: (e: KeyboardEvent) => void;
}

export type DialogProps = MergeElementProps<"div", DialogBaseProps>;

type Component = {
  (props: DialogProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<DialogProps> | undefined;
  displayName?: string | undefined;
};

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

const register =
  (name: string, map: Map<string, HTMLDivElement>) => (node: HTMLDivElement) =>
    void map.set(name, node);

const DialogBase = (props: DialogProps, ref: React.Ref<HTMLDivElement>) => {
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

  const nodesMap = new Map<string, HTMLDivElement>();
  const dialogRef = React.useRef<HTMLDivElement>(null);

  const [state, setState] = React.useState({
    hasOverflow: false,
    bodyHeight: 0
  });

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

  const backdropClickHandler: DialogProps["onBackdropClick"] = e => {
    if (onBackdropClick) onBackdropClick(e);
  };

  const escapeKeyUpHandler = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "escape" || e.key.toLowerCase() === "esc") {
      if (onEscapeKeyUp) onEscapeKeyUp(e);
    }
  };

  if (!isSsr) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEventListener(
      {
        target: document,
        eventType: "keyup",
        handler: escapeKeyUpHandler
      },
      openState && onEscapeKeyUp != null
    );
  }

  return (
    <PortalDestination aria-hidden={!openState}>
      <div
        tabIndex={-1}
        ref={ref}
        className={c(classes.root, className, {
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
};

const Dialog = React.forwardRef(DialogBase) as Component;

Dialog.propTypes = {
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
