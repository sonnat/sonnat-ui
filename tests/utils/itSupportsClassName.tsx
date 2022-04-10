// Cherry picked from https://github.com/mantinedev/mantine/blob/master/src/mantine-tests/src/it-supports-classname.tsx

import * as React from "react";
import { render } from ".";

const cls = "sonnat-component-test-classname";

const itSupportsClassName = <T,>(
  Component: React.ComponentType<T>,
  requiredProps: T
): void => {
  it("supports className prop", () => {
    const { container } = render(
      <Component {...requiredProps} className={cls} />
    );
    expect(container.firstChild).toHaveClass(cls);
  });
};

export default itSupportsClassName;
