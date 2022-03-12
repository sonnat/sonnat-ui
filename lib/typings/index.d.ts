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

/** Removes types from T that are assignable to U */
export type Diff<T, U> = T extends U ? never : T;

/** Removes types from T that are not assignable to U */
export type Filter<T, U> = T extends U ? T : never;

/** Constructs a type by including null and undefined to Type. */
export type Nullable<T> = { [P in keyof T]: T[P] | null | undefined };

export type NotUndefined<T> = T extends undefined ? never : T;

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

export type Styles<T = DefaultTheme, P = unknown, N extends string = string> =
  | JssStyles<N, P, T>
  | ((theme: T) => JssStyles<N, P, undefined>);

export type Classes<Name extends string = string> = JssClasses<Name>;

// eslint-disable-next-line @typescript-eslint/ban-types
export type EmptyIntersectionObject = {};

export type AnyObject = Record<string | number | symbol, unknown>;
export type EmptyObject = Record<string | number | symbol, never>;

export type MergeElementProps<
  T extends React.ElementType,
  P = EmptyIntersectionObject
> = Overwrite<React.ComponentPropsWithRef<T>, P>;

/**
 * Helps create a type where at least one of the properties of an interface is required to exist.
 */
export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Diff<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Diff<Keys, K>>>;
  }[Keys];

/**
 * Helps create a type where only one of the properties of an interface is required to exist.
 */
export type RequireOnlyOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Diff<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> &
      Partial<Record<Diff<Keys, K>, undefined>>;
  }[Keys];
