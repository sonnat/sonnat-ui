// Cherry picked from https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/it-supports-others.tsx

import * as React from "react";
import { render } from ".";

const itSupportsDataSetProps = <T,>(
  Component: React.ComponentType<T>,
  requiredProps: T
): void => {
  it("supports dataset props", () => {
    const { container } = render(
      <Component {...requiredProps} data-other-attribute="test" />
    );
    expect(container.firstChild).toHaveAttribute(
      "data-other-attribute",
      "test"
    );
  });
};

export default itSupportsDataSetProps;
