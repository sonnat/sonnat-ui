/* eslint-disable no-unused-vars */
import { CSSProperties } from "react";
import { DefaultTheme } from "../../styles/defaultTheme";
import {
  Jss as DefaultJss,
  StyleSheetFactoryOptions as JssStyleSheetFactoryOptions,
  Styles as JssStyles,
  Classes as JssClasses,
  GenerateId as JssGenerateId,
  SheetsRegistry as JssSheetsRegistry
} from "jss";

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
export type OverridableStringUnion<T, U = {}> = GenerateStringUnion<
  Overwrite<T, U>
>;

export type GenerateClassName = JssGenerateId;
export type SheetsRegistry = JssSheetsRegistry;
export type Jss = DefaultJss;
export type StyleSheetFactoryOptions = JssStyleSheetFactoryOptions;

export interface MakeStylesOptions extends StyleSheetFactoryOptions {
  name?: string;
}

export type Styles<Theme = DefaultTheme, C extends string = string> =
  | JssStyles<C>
  | ((theme: Theme) => JssStyles<C>);

export type Classes<C extends string = string> = JssClasses<C>;
