// Cherry picked from https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/it-supports-focus-events.tsx

import * as React from "react";
import { fireEvent } from "@testing-library/react";
import { render } from ".";

const itSupportsFocusEvents = <T,>(
  Component: React.ComponentType<T>,
  requiredProps: T,
  selector: string
): void => {
  it("supports focus events", () => {
    const onFocusSpy = jest.fn();
    const onBlurSpy = jest.fn();

    const { container } = render(
      <Component {...requiredProps} onFocus={onFocusSpy} onBlur={onBlurSpy} />
    );

    fireEvent.focus(container.querySelector(selector) as Element);
    expect(onFocusSpy).toHaveBeenCalled();

    fireEvent.blur(container.querySelector(selector) as Element);
    expect(onBlurSpy).toHaveBeenCalled();
  });
};

export default itSupportsFocusEvents;
