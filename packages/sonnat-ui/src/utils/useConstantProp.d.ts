export type ErrorHandler = () => string;

/**
 * @function useConstantProp
 *
 * @param {T} initialValue The initial value.
 * @param {T} defaultValue The default value.
 * @param {object} errorHandlingOptions The options for the error handling.
 * @param {string} errorHandlingOptions.componentName The name of the component owns this prop.
 * @param {string} errorHandlingOptions.propName The name of the prop.
 * @param {ErrorHandler} errorHandlingOptions.errorHandler The errorHandler callback.
 *
 * @returns {T} Returns the constant value.
 */
export default function useConstantProp<T = unknown>(
  /* eslint-disable no-unused-vars */
  initialValue: T | undefined,
  defaultValue: T | undefined,
  options: {
    componentName: string;
    propName?: string;
    errorHandler?: ErrorHandler;
  }
): /* eslint-enable no-unused-vars */
T;
