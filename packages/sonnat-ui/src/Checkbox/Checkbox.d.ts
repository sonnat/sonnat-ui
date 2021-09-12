import * as React from "react";
import type { EmptyIntersectionObject, MergeElementProps } from "../typings";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  ref?: React.Ref<HTMLInputElement>;
}

export interface LabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {
  ref?: React.Ref<HTMLLabelElement>;
}

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * If `label` was provided, a `<label>` element will be rendered next to the checkbox.
     */
    label?: string;
    /** The name of the checkbox. */
    name?: string;
    /**
     * The value of the checkbox. The DOM API casts this to a string.
     * The browser uses "on" as the default value.
     */
    value?: string;
    /**
     * If `true`, the checkbox will appear indeterminate.
     * This does not set the native input element to indeterminate due
     * to inconsistent behavior across browsers.
     * @default false
     */
    indeterminated?: boolean;
    /**
     * If `true`, the checkbox will be focused automatically.
     * @default false
     */
    autoFocus?: boolean;
    /**
     * If `true`, the checkbox will be read-only.
     * @default false
     */
    readOnly?: boolean;
    /**
     * If `true`, the checkbox will be checked.
     */
    checked?: boolean;
    /**
     * The default state of `checked`. Use when the component is not controlled.
     */
    defaultChecked?: boolean;
    /**
     * If `true`, the checkbox will be disabled.
     * @default false
     */
    disabled?: boolean;
    /**
     * If `true`, the checkbox will be required.
     * @default false
     */
    required?: boolean;
    /**
     * If `true`, the checkbox will indicate invalid input.
     * @default false
     */
    hasError?: boolean;
    /**
     * The size of the checkbox.
     * @default "medium"
     */
    size?: "large" | "medium" | "small";
    /**
     * The Callback fires when the state has changed.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} event The event source of the callback.
     * @param {boolean} checkedState The new checked state.
     *
     * You can also pull out the new checked state by accessing `event.target.checked` (boolean).
     */
    onChange?: (
      /* eslint-disable no-unused-vars */
      event: React.ChangeEvent<HTMLInputElement>,
      checkedState: boolean
      /* eslint-enable no-unused-vars */
    ) => void;
    /**
     * The Callback fires when the checkbox has received focus.
     *
     * @param {React.FocusEvent<HTMLInputElement>} event The event source of the callback.
     */
    // eslint-disable-next-line no-unused-vars
    onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /**
     * The Callback fires when the checkbox has lost focus.
     *
     * @param {React.FocusEvent<HTMLInputElement>} event The event source of the callback.
     */
    // eslint-disable-next-line no-unused-vars
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    /** The properties applied to the `input` element. */
    inputProps?: InputProps;
    /** The properties applied to the `label` element. */
    labelProps?: LabelProps;
  };

export type CheckboxProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"div", BaseProps<P>>;

declare const Checkbox: (props: CheckboxProps) => JSX.Element;

export default Checkbox;
