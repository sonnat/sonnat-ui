import * as React from "react";

type HandleState = {
  active: boolean;
  currentX: number;
  initialX: number;
  offsetX: number;
  zIndex: number;
};

export type State = {
  sup: HandleState & { right: number };
  inf: HandleState & { left: number };
  track: { right: number; left: number };
};

type BaseProps<P = {}> = P & {
  /**
   * Append to the classNames applied to the component so you can override or
   * extend the styles.
   */
  className?: string;
  /**
   * The maximum allowed value of the slider. Should not be equal to min.
   */
  max?: number;
  /**
   * The minimum allowed value of the slider. Should not be equal to min.
   */
  min?: number;
  /**
   * The Number of digits after the decimal point. Must be in the range 0 to 20, inclusive.
   */
  fractionDigits?: number;
  /**
   * The granularity with which the slider can step through values.
   *
   * It's **required** to use this when you are using a `discrete` slider.
   */
  step?: number;
  /**
   * The value of the slider.
   *
   * For bidirectional sliders, provide an array with two values.
   */
  value?: number | number[];
  /**
   * The default value. Use when the slider is not controlled.
   *
   * For bidirectional sliders, provide an array with two values.
   */
  defaultValue?: number | number[];
  /**
   * The variant of the slider.
   * @default "continuous"
   */
  variant?: "continuous" | "discrete";
  /**
   * 	If `true`, the component will be disabled.
   * @default true
   */
  disabled?: boolean;
  /**
   * The Callback fires when the value has changed.
   *
   * @param {React.MouseEvent<HTMLDivElement>
   * | React.TouchEvent<HTMLDivElement>} event The event source of the callback.
   * @param {number | number[]} newValue The new value of the slider.
   */
  onChange?: (
    /* eslint-disable no-unused-vars */
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
    newValue: number | number[]
    /* eslint-enable no-unused-vars */
  ) => void;
  /**
   * The Callback fires when the slider is being dragged.
   *
   * @param {React.MouseEvent<HTMLElement>
   * | React.TouchEvent<HTMLElement>} event The event source of the callback.
   * @param {State} state The state of slider's handles and track(rail).
   */
  onDragging?: (
    /* eslint-disable no-unused-vars */
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    state: State
    /* eslint-enable no-unused-vars */
  ) => void;
  /**
   * The Callback fires when the dragging starts.
   *
   * @param {React.MouseEvent<HTMLElement>
   * | React.TouchEvent<HTMLElement>} event The event source of the callback.
   * @param {State} state The state of slider's handles and track(rail).
   */
  onDragStart?: (
    /* eslint-disable no-unused-vars */
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    state: State
    /* eslint-enable no-unused-vars */
  ) => void;
  /**
   * The Callback fires when the dragging ends.
   *
   * @param {React.MouseEvent<HTMLElement>
   * | React.TouchEvent<HTMLElement>} event The event source of the callback.
   * @param {State} state The state of slider's handles and track(rail).
   */
  onDragEnd?: (
    /* eslint-disable no-unused-vars */
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>,
    state: State
    /* eslint-enable no-unused-vars */
  ) => void;
  /**
   * The Callback fires when the component mounts.
   */
  onMount?: () => void;
  /**
   * The Callback fires when the component dismounts.
   */
  onDismount?: () => void;
};

export type InputSliderProps<P = {}> = BaseProps<P> &
  Omit<React.ComponentPropsWithRef<"div">, keyof BaseProps<P>>;

export interface InputSliderFC<P> {
  // eslint-disable-next-line no-unused-vars
  (props: InputSliderProps<P>): JSX.Element;
}

declare const InputSlider: InputSliderFC<{}>;

export default InputSlider;
