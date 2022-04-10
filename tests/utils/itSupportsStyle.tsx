// Cherry picked from https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/it-supports-style.tsx

import * as React from "react";
import { render } from ".";

const itSupportsStyle = <T,>(
  Component: React.ComponentType<T>,
  requiredProps: T
): void => {
  it("supports style prop", () => {
    const style = { border: "1px solid red", background: "black" };

    const { container } = render(
      <Component {...requiredProps} style={style} />
    );
    expect(container.firstChild).toHaveStyle(style);
  });
};

export default itSupportsStyle;
