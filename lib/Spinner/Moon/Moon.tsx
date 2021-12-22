import c from "classnames";
import PropTypes from "prop-types";
import * as React from "react";
import useTheme from "../../styles/useTheme";
import type { MergeElementProps } from "../../typings";
import useStyles from "./styles";

interface MoonBaseProps {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * Sets the backgroundColor of the Spinner.
   */
  backgroundColor?: string;
  /**
   * Sets the foregroundColor of the Spinner.
   */
  foregroundColor?: string;
  /**
   * The size of the Spinner in pixels.
   */
  size?: number;
}

export type MoonSpinnerProps = MergeElementProps<"div", MoonBaseProps>;

type Component = {
  (props: MoonSpinnerProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<MoonSpinnerProps> | undefined;
  displayName?: string | undefined;
};

const MoonSpinnerBase = (props: MoonSpinnerProps) => {
  const {
    className,
    size,
    backgroundColor,
    foregroundColor,
    style,
    ...otherProps
  } = props;

  const {
    colors,
    darkMode,
    typography: { pxToRem }
  } = useTheme();

  const classes = useStyles();

  const sizing = {
    width: (size && pxToRem(size)) || pxToRem(20),
    height: (size && pxToRem(size)) || pxToRem(20),
    minWidth: (size && pxToRem(size)) || pxToRem(20),
    minHeight: (size && pxToRem(size)) || pxToRem(20)
  };

  const coloring = {
    background: backgroundColor || colors.divider,
    foreground:
      foregroundColor ||
      (!darkMode
        ? colors.createBlackColor({ alpha: 0.48 })
        : colors.createWhiteColor({ alpha: 0.48 }))
  };

  return (
    <div
      className={c(classes.root, className)}
      style={{ ...style, ...sizing }}
      {...otherProps}
    >
      <div
        className={classes.base}
        style={{ border: `${pxToRem(4)} solid ${coloring.background}` }}
      >
        <div
          className={classes.movingParticle}
          style={{ backgroundColor: coloring.foreground }}
        />
      </div>
    </div>
  );
};

const MoonSpinner = MoonSpinnerBase as Component;

MoonSpinner.propTypes = {
  className: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object,
  backgroundColor: PropTypes.string,
  foregroundColor: PropTypes.string
};

export default MoonSpinner;
