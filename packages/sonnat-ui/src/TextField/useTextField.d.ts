export interface TextFieldState {
  /**
   * Determines whether the TextField is empty or not.
   *
   * @default false
   */
  isEmpty?: boolean;
}

export default function useTextField(): TextFieldState | undefined;
