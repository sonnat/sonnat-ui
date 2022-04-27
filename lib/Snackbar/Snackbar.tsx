import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import CloseLarge from "../internals/icons/CloseLarge";
import type { MergeElementProps } from "../typings";
import { onNextFrame, useOnChange } from "../utils";
import useStyles from "./styles";

interface SnackbarBaseProps {
  /** The text to display. */
  text: string;
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The text to display on the action button.
   */
  actionLabel?: string;
  /**
   * The leading icon element placed before the text.
   */
  icon?: React.ReactNode;
  /**
   * The horizontal placement of the snackbar.
   * @default "center"
   */
  placement?: "left" | "center" | "right";
  /**
   * If `true`, the Snackbar automatically closes after a calculated time.
   * This calculated time depends on the number of characters in the Snackbar's content.
   *
   * If a number is entered, the Snackbar will be closed after that amount of time (in miliseconds).
   * @default false
   */
  autoHide?: number | boolean;
  /**
   * If `true`, the component will be open.
   * @default false
   */
  open?: boolean;
  /**
   * If `true`, the snackbar will have close button.
   * @default false
   */
  closable?: boolean;
  /**
   * The Callback fires when the close button is clicked.
   */
  onClose?: () => void;
  /**
   * The Callback fires when the action button is clicked.
   */
  actionCallback?: () => void;
  /**
   * The Callback fires when the transition has ended.
   */
  onTransitionEnd?: (event: React.TransitionEvent<HTMLDivElement>) => void;
  /**
   * The color of the snackbar.
   * @default "default"
   */
  color?: "default" | "success" | "error" | "warning" | "info";
}

export type SnackbarProps = Omit<
  MergeElementProps<"div", SnackbarBaseProps>,
  "defaultChecked" | "defaultValue"
>;

type Component = {
  (props: SnackbarProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<SnackbarProps> | undefined;
  displayName?: string | undefined;
};

const allowedPlacements = ["left", "center", "right"] as const;
const allowedColors = [
  "default",
  "success",
  "error",
  "warning",
  "info"
] as const;

const SnackbarBase = (props: SnackbarProps, ref: React.Ref<HTMLDivElement>) => {
  const {
    text,
    className,
    icon,
    onClose,
    onTransitionEnd,
    actionLabel,
    actionCallback,
    autoHide = false,
    open = false,
    closable = false,
    placement = "center",
    color = "default",
    ...otherProps
  } = props;

  const classes = useStyles();

  const timeout = React.useRef<number>(-1);

  const [isHidden, setHidden] = React.useState(open);
  const [isOpen, setOpen] = React.useState(false);

  const isActionable = typeof actionLabel !== "undefined";

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
        timeout.current = window.setTimeout(() => {
          setOpen(false);
        }, autoHideValue);
      }
    } else setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const transitionEndHandler = (e: React.TransitionEvent<HTMLDivElement>) => {
    onTransitionEnd?.(e);
    if (!isOpen) setHidden(true);
  };

  useOnChange(isOpen, currentOpen => void (!currentOpen && onClose?.()));

  return !isHidden ? (
    <div
      ref={ref}
      role="alert"
      onTransitionEnd={transitionEndHandler}
      className={c(classes.root, classes[placement], className, {
        [classes[color]]: allowedColors.includes(color),
        [classes.open]: isOpen,
        [classes.autoHidable]: hasNumericAutoCloseInput && isAutoHidable
      })}
      {...otherProps}
    >
      {hasNumericAutoCloseInput && (
        <div className={classes.hideDurationWrapper}>
          <div
            className={classes.hideDurationIndicator}
            style={{ transition: `width ${autoHideValue.toString()}ms ease` }}
          ></div>
        </div>
      )}
      {icon && <i className={classes.icon}>{icon}</i>}
      <span className={classes.text}>{text}</span>
      {isActionable && (
        <div
          role="button"
          className={classes.actionButton}
          onClick={() => void actionCallback?.()}
        >
          <span className={classes.actionLabel}>{actionLabel}</span>
        </div>
      )}
      {isActionable && closable && <div className={classes.divider}></div>}
      {closable && (
        <div
          role="button"
          aria-label="Close Button"
          className={classes.closeButton}
          onClick={() => {
            if (timeout.current != null) clearTimeout(timeout.current);
            onClose?.();
          }}
        >
          <CloseLarge size={16} className={classes.closeButtonIcon} />
        </div>
      )}
    </div>
  ) : null;
};

const Snackbar = React.forwardRef(SnackbarBase) as Component;

Snackbar.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string,
  icon: PropTypes.node,
  actionLabel: PropTypes.string,
  placement: PropTypes.oneOf(allowedPlacements),
  autoHide: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  color: PropTypes.oneOf(allowedColors),
  open: PropTypes.bool,
  closable: PropTypes.bool,
  onClose: PropTypes.func,
  actionCallback: PropTypes.func,
  onTransitionEnd: PropTypes.func
};

export default Snackbar;
