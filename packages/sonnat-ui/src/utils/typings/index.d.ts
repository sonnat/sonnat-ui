/* eslint-disable no-unused-vars */
import { CSSProperties } from "react";
import { DefaultTheme } from "../../styles/defaultTheme";
import { StyleSheetFactoryOptions } from "jss";

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

export type PropsFunc<Props extends object, T> = (props: Props) => T;

export type BaseCreateCSSProperties<Props extends object = {}> = {
  [P in keyof CSSProperties]:
    | CSSProperties[P]
    | PropsFunc<Props, CSSProperties[P]>;
};

export interface CreateCSSProperties<Props extends object = {}>
  extends BaseCreateCSSProperties<Props> {
  // Allow pseudo selectors and media queries
  [k: string]:
    | BaseCreateCSSProperties<Props>[keyof BaseCreateCSSProperties<Props>]
    | CreateCSSProperties<Props>;
}

/**
 * This is basically the API of JSS. It defines a Map<string, CSS>,
 * where
 * - the `keys` are the class (names) that will be created
 * - the `values` are objects that represent CSS rules (`React.CSSProperties`).
 *
 * if only `CSSProperties` are matched `Props` are inferred to `any`
 */
export type StyleRules<
  Props extends object = {},
  ClassKey extends string = string
> = Record<
  ClassKey,
  | CSSProperties
  | CreateCSSProperties<Props>
  | PropsFunc<Props, CreateCSSProperties<Props>>
>;

export type StyleRulesCallback<
  Theme,
  Props extends object,
  ClassKey extends string = string
> = (theme: Theme) => StyleRules<Props, ClassKey>;

export type Styles<
  Theme,
  Props extends object,
  ClassKey extends string = string
> = StyleRules<Props, ClassKey> | StyleRulesCallback<Theme, Props, ClassKey>;

export type ClassNameMap<ClassKey extends string = string> = Record<
  ClassKey,
  string
>;

export interface MakeStylesOptions<Theme = DefaultTheme>
  extends StyleSheetFactoryOptions {
  defaultTheme?: Theme;
  name?: string;
}
