import * as React from "react";

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /** The name of the Stepper. */
  name?: string;
  /**
   * The value of the Stepper. The DOM API casts this to a string.
   */
  value?: number | string;
  /**
   * The default value. Use when the component is not controlled.
   */
  defaultValue?: number | string;
  /**
   * If `true`, the Stepper will fill the entire width of the parent.
   * @default false
   */
  fluid?: boolean;
  /**
   * If `true`, the Stepper will be disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * The size of the Stepper.
   * @default "medium"
   */
  size?: "medium" | "small";
  /**
   * The minimum value the Stepper can hold.
   * @default 0
   */
  min?: number;
  /**
   * The maximum value the Stepper can hold.
   * @default Infinity
   */
  max?: number;
  /** The properties applied to the `input` element. */
  inputProps?: {
    ref: React.Ref<HTMLInputElement>;
  } & React.HTMLAttributes<HTMLInputElement>;
  /**
   * The Callback fires when the state has changed.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
   * @param {number} value The current value of the Stepper.
   */
  onChange?: (
    /* eslint-disable no-unused-vars */
    event: React.ChangeEvent<HTMLInputElement>,
    value: number
    /* eslint-enable no-unused-vars */
  ) => void;
  /**
   * The Callback fires when the add button has been clicked.
   *
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The event source of the callback.
   * @param {number} value The current value of the Stepper.
   */
  onAdd?: (
    /* eslint-disable no-unused-vars */
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: number
    /* eslint-enable no-unused-vars */
  ) => void;
  /**
   * The Callback fires when the subtract button has been clicked.
   *
   * @param {React.MouseEvent<HTMLButtonElement, MouseEvent>} event The event source of the callback.
   * @param {number} value The current value of the Stepper.
   */
  onSubtract?: (
    /* eslint-disable no-unused-vars */
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    value: number
    /* eslint-enable no-unused-vars */
  ) => void;
};
export type StepperProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface StepperFC<P = {}> {
  // eslint-disable-next-line no-unused-vars
  (props: StepperProps<P>): JSX.Element;
}

declare const Stepper: StepperFC<{}>;

export default Stepper;