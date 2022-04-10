import {
  itShouldMount,
  itIsPolymorphic,
  itGeneratesJssClassNames,
  itSupportsClassName,
  itSupportsStyle,
  itSupportsRef,
  itSupportsFocusEvents,
  itSupportsDataSetProps
} from ".";

const describeConformance = <T>(
  Component: React.ComponentType<T>,
  refType: unknown,
  props: T
): void => {
  describe(`Conformance of ${Component.displayName}`, () => {
    itShouldMount(Component, props);
    itIsPolymorphic(Component, props);
    itGeneratesJssClassNames(Component, props);
    itSupportsClassName(Component, props);
    itSupportsStyle(Component, props);
    itSupportsRef(Component, props, refType);
    itSupportsFocusEvents(Component, props, "button");
    itSupportsDataSetProps(Component, props);
  });
};

export default describeConformance;
