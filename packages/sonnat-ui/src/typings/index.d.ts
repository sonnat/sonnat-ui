import type {
  Classes as JssClasses,
  GenerateId as JssGenerateId,
  Jss as DefaultJss,
  SheetsRegistry as JssSheetsRegistry,
  Styles as JssStyles,
  StyleSheetFactoryOptions as JssStyleSheetFactoryOptions
} from "jss";
import * as React from "react";
import type { DefaultTheme } from "../styles/defaultTheme";

type GenerateStringUnion<T> = Extract<
  {
    [Key in keyof T]: true extends T[Key] ? Key : never;
  }[keyof T],
  string
>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type EmptyIntersectionObject = {};

/** Removes types from T that are assignable to U */
export type Diff<T, U> = T extends U ? never : T;

/** Removes types from T that are not assignable to U */
export type Filter<T, U> = T extends U ? T : never;

/** Constructs a type by including null and undefined to Type. */
export type Nullable<T> = { [P in keyof T]: T[P] | null | undefined };

/**
 * Like `T & U`, but using the value types from `U` where their properties overlap.
 */
export type Overwrite<T, U> = Omit<T, keyof U> & U;

/**
 * Generate a set of string literal types with the given default record `T` and
 * override record `U`.
 *
 * If the property value was `true`, the property key will be added to the
 * string union.
 */
export type OverridableStringUnion<
  T,
  U = EmptyIntersectionObject
> = GenerateStringUnion<Overwrite<T, U>>;

export type GenerateClassName = JssGenerateId;
export type SheetsRegistry = JssSheetsRegistry;
export type Jss = DefaultJss;
export type StyleSheetFactoryOptions = JssStyleSheetFactoryOptions;

export interface MakeStylesOptions extends StyleSheetFactoryOptions {
  name?: string;
}

export type Styles<
  Theme = DefaultTheme,
  Props = unknown,
  Name extends string = string
> =
  | JssStyles<Name, Props, Theme>
  | ((theme: Theme) => JssStyles<Name, Props, undefined>);

export type Classes<Name extends string = string> = JssClasses<Name>;

export type MergeElementProps<
  T extends React.ElementType,
  P extends Record<string, unknown> = Record<string, never>
> = Omit<React.ComponentPropsWithRef<T>, keyof P> & P;
