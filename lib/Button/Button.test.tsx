import * as React from "react";
import { fireEvent } from "@testing-library/react";
import Button from ".";
import {
  render,
  describeConformance,
  testClassNamesMatch,
  screen
} from "../../tests/utils";

const label = "Hello World!";

const icons = {
  leading: () => <span aria-label="leading-icon" />,
  trailing: () => <span aria-label="trailing-icon" />
};

const buttonClassNames = {
  root: "root",
  rounded: "rounded",
  large: "large",
  medium: "medium",
  small: "small",
  filled: "filled",
  filledDefault: "filledDefault",
  filledPrimary: "filledPrimary",
  filledSecondary: "filledSecondary",
  outlined: "outlined",
  outlinedDefault: "outlinedDefault",
  outlinedPrimary: "outlinedPrimary",
  outlinedSecondary: "outlinedSecondary",
  inlined: "inlined",
  inlinedDefault: "inlinedDefault",
  inlinedPrimary: "inlinedPrimary",
  inlinedSecondary: "inlinedSecondary",
  raised: "raised",
  disabled: "disabled",
  loading: "loading",
  iconed: "iconed",
  leadingIcon: "leadingIcon",
  trailingIcon: "trailingIcon",
  focusVisible: "focusVisible"
} as const;

type ClassNames<T> = T[keyof T][];
type ButtonClassnames = ClassNames<typeof buttonClassNames>;

describe("@sonnat-ui/Button", () => {
  const callback = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  describeConformance(Button, HTMLButtonElement, { label });

  it("label must be rendered", () => {
    render(<Button label={label} />);
    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  it("should render with the root, filled, medium & filledDefault classes but no others", () => {
    render(<Button label={label} />);
    const button = screen.getByRole("button");

    const allowedClassnameKeys: ButtonClassnames = [
      "root",
      "filled",
      "medium",
      "filledDefault"
    ];

    testClassNamesMatch(button, buttonClassNames, allowedClassnameKeys);
  });

  it("should render with the root, filled, medium & filledDefault classes but no others", () => {
    render(<Button variant="filled" label={label} />);
    const button = screen.getByRole("button");

    const allowedClassnameKeys: ButtonClassnames = [
      "root",
      "filled",
      "medium",
      "filledDefault"
    ];

    testClassNamesMatch(button, buttonClassNames, allowedClassnameKeys);
  });

  it("should render with the root, filled, medium & filledDefault classes but no others", () => {
    render(<Button variant="filled" color="default" label={label} />);
    const button = screen.getByRole("button");

    const allowedClassnameKeys: ButtonClassnames = [
      "root",
      "filled",
      "medium",
      "filledDefault"
    ];

    testClassNamesMatch(button, buttonClassNames, allowedClassnameKeys);
  });

  it("should render with the root, filled, medium & filledPrimary classes but no others", () => {
    render(<Button variant="filled" color="primary" label={label} />);
    const button = screen.getByRole("button");

    const allowedClassnameKeys: ButtonClassnames = [
      "root",
      "filled",
      "medium",
      "filledPrimary"
    ];

    testClassNamesMatch(button, buttonClassNames, allowedClassnameKeys);
  });

  it("should render leading icon", () => {
    render(<Button label={label} leadingIcon={<icons.leading />} />);

    const leadingIcon = screen.getByLabelText("leading-icon");
    expect(leadingIcon).toBeInTheDocument();
  });

  it("should render trailing icon", () => {
    render(<Button label={label} trailingIcon={<icons.trailing />} />);

    const trailingIcon = screen.getByLabelText("trailing-icon");
    expect(trailingIcon).toBeInTheDocument();
  });

  it("should render leading and trailing icons together", () => {
    render(
      <Button
        label={label}
        leadingIcon={<icons.leading />}
        trailingIcon={<icons.trailing />}
      />
    );

    const leadingIcon = screen.getByLabelText("leading-icon");
    expect(leadingIcon).toBeInTheDocument();

    const trailingIcon = screen.getByLabelText("trailing-icon");
    expect(trailingIcon).toBeInTheDocument();
  });

  it("should get disabled", () => {
    render(<Button disabled label={label} />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });

  it("label must be invisible when loading is true", () => {
    render(<Button loading label={label} />);
    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();
  });

  it("callback must be fired onClick", () => {
    render(<Button label={label} onClick={callback} />);
    const button = screen.getByRole("button");
    button.click();
    expect(callback).toBeCalledTimes(1);
  });

  it("callback must be fired onBlur", () => {
    render(<Button label={label} onBlur={callback} />);
    const button = screen.getByRole("button");

    button.focus();
    button.blur();

    expect(callback).toBeCalledTimes(1);
  });

  it("callback must be fired onKeyDown", () => {
    render(<Button label={label} onKeyDown={callback} />);
    const button = screen.getByRole("button");

    button.focus();
    fireEvent.keyDown(document.activeElement || document.body);

    expect(callback).toBeCalledTimes(1);
  });

  it("callback must be fired onKeyUp", () => {
    render(<Button label={label} onKeyUp={callback} />);
    const button = screen.getByRole("button");

    button.focus();
    fireEvent.keyUp(document.activeElement || document.body);

    expect(callback).toBeCalledTimes(1);
  });
});
