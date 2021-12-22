import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import Button from "../Button";
import CloseLarge from "../internals/icons/CloseLarge";
import { ThemeProvider, useDarkMode, useTheme } from "../styles";
import type { MergeElementProps } from "../typings";
import onNextFrame from "../utils/onNextFrame";
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
   * The text to display on the undo button.
   */
  undoButtonLabel?: string;
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
   * If `true`, the snackbar will have undo button.
   * @default false
   */
  undoable?: boolean;
  /**
   * The Callback fires when the close button is clicked.
   */
  onClose?: () => void;
  /**
   * The Callback fires when the item has received focus.
   */
  onUndo?: () => void;
  /**
   * The Callback fires when the transition has ended.
   */
  onTransitionEnd?: (event: React.TransitionEvent<HTMLDivElement>) => void;
}

export type SnackbarProps = MergeElementProps<"div", SnackbarBaseProps>;

type Component = {
  (props: SnackbarProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<SnackbarProps> | undefined;
  displayName?: string | undefined;
};

const allowedPlacements = ["left", "center", "right"] as const;

const SnackbarBase = (props: SnackbarProps, ref: React.Ref<HTMLDivElement>) => {
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

  const timeout = React.useRef<number>(-1);

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
        timeout.current = window.setTimeout(() => {
          setOpen(false);
        }, autoHideValue);
      }
    } else setOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const transitionEndHandler = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (onTransitionEnd) onTransitionEnd(e);
    if (!isOpen) setHidden(true);
  };

  return !isHidden ? (
    <ThemeProvider theme={newTheme}>
      <div
        ref={ref}
        role="alert"
        onTransitionEnd={transitionEndHandler}
        className={c(classes.root, classes[placement], className, {
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
            onClick={() => {
              if (timeout.current != null) clearTimeout(timeout.current);
              if (onClose) onClose();
            }}
          />
        )}
      </div>
    </ThemeProvider>
  ) : null;
};

const Snackbar = React.forwardRef(SnackbarBase) as Component;

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
