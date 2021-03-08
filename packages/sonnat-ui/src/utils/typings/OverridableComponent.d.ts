import * as React from "react";

export interface OverridableTypeMap {
  props: {};
  defaultRootNode: React.ElementType;
}

/** Props defined on the component. */
export type BaseProps<TM extends OverridableTypeMap> = TM["props"];

/** Props of the component if `rootNode={rootNode}` is used. */
export type OverrideProps<
  TM extends OverridableTypeMap,
  N extends React.ElementType
> = BaseProps<TM> & Omit<React.ComponentPropsWithRef<N>, keyof BaseProps<TM>>;

/** Props if `rootNode={rootNode}` is NOT used. */
export type DefaultComponentProps<TM extends OverridableTypeMap> = BaseProps<
  TM
> &
  Omit<React.ComponentPropsWithRef<TM["defaultRootNode"]>, keyof BaseProps<TM>>;

/**
 * A component whose root component can be controlled via a `rootNode` prop.
 *
 * Adjusts valid props based on the type of `rootNode`.
 */
export interface OverridableComponent<TM extends OverridableTypeMap> {
  <N extends React.ElementType>(
    // eslint-disable-next-line no-unused-vars
    props: {
      /**
       * The component used for the root node.
       * Either a string to use a HTML element or a component.
       */
      rootNode: N;
    } & OverrideProps<TM, N>
  ): JSX.Element;
  // eslint-disable-next-line no-unused-vars
  (props: DefaultComponentProps<TM>): JSX.Element;
}
