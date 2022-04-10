import * as React from "react";
import { render } from ".";

const SonnatJssClassNamesRegExp = /^Sonnat[A-Z][a-z]+-[a-zA-Z]+-[0-9]+$/;

const itGeneratesJssClassNames = <T,>(
  Component: React.ComponentType<T>,
  requiredProps: T
): void => {
  it("generates classnames based on Sonnat JSS system", () => {
    const { container } = render(<Component {...requiredProps} />);

    Array.from((container.firstChild as HTMLElement).classList).map(
      className => {
        expect(className).toMatch(SonnatJssClassNamesRegExp);
      }
    );
  });
};

export default itGeneratesJssClassNames;
