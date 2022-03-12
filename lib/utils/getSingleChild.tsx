import * as React from "react";
import { isFragment } from "react-is";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
const getSingleChild = <P extends unknown>(
  children: React.ReactNode,
  componentName?: string
): React.ReactElement<P> | null => {
  if (!children) {
    // eslint-disable-next-line no-console
    console.error(
      "Sonnat: The `children` prop has to be a single valid element."
    );

    return null;
  }

  if (!React.isValidElement(children)) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(
        `Sonnat: The \`children\` provided to the ${
          componentName ?? "component"
        } isn't a valid children.`
      );
    }

    return null;
  }

  if (isFragment(children)) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(
        `Sonnat: The ${
          componentName ?? "component"
        } doesn't accept Fragment as children.`
      );
    }

    return null;
  }

  try {
    return React.Children.only(children) as React.ReactElement;
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(
        "Sonnat: The `children` prop has to be a single valid element."
      );
    }

    return null;
  }
};

export default getSingleChild;
