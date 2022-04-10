/* eslint-disable react/no-children-prop */
import * as React from "react";
import { createTheme, ThemeProvider } from "../../lib/styles";
import { render } from ".";

const itShouldMount = <T,>(
  Component: React.ComponentType<T>,
  requiredProps: T
): void => {
  it(`component could be updated and unmounted without errors`, () => {
    const elem = (<Component {...requiredProps} />) as React.ReactElement;

    /*  TODO -> remove ThemeProvider */
    const result = render(<Component {...requiredProps} />, {
      wrapper: () => <ThemeProvider theme={createTheme({})} children={elem} />
    });

    expect(() => {
      result.rerender(elem);
      result.unmount();
    }).not.toThrow();
  });
};

export default itShouldMount;
