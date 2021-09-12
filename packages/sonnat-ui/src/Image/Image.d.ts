import type { MergeElementProps } from "../typings";

type BaseProps<P extends Record<string, unknown> = EmptyIntersectionObject> =
  P & {
    /**
     * Append to the classNames applied to the component so you can override or
     * extend the styles.
     */
    className?: string;
    /**
     * The size of the image. Must be one of the following:
     * 1- A statically imported image file, or
     * 2- A path string.
     */
    src: string | Record<string, unknown>;
    /**
     * The width of the image, in pixels. Must be an integer without a unit.
     * Required, except for statically imported images, or those with `layout="fill"`.
     */
    width?: string | number;
    /**
     * The height of the image, in pixels. Must be an integer without a unit.
     * Required, except for statically imported images, or those with `layout="fill"`.
     */
    height?: string | number;
    /**
     * The layout behavior of the image as the viewport changes size.
     * @default "intrinsic"
     */
    layout?: "fill" | "fixed" | "intrinsic" | "responsive";
  };

export type ImageProps<
  P extends Record<string, unknown> = EmptyIntersectionObject
> = MergeElementProps<"img", BaseProps<P>>;

declare const Image: (props: ImageProps) => JSX.Element;

export default Image;
