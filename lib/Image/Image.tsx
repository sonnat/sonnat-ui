// Based on the next/image package (https://github.com/vercel/next.js/blob/canary/packages/next/client/image.tsx)
import PropTypes from "prop-types";
import * as React from "react";
import Skeleton from "../Skeleton";
import type { MergeElementProps } from "../typings";
import { setRef, useIntersection } from "../utils";

interface ImageBaseProps {
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
}

export type ImageProps = MergeElementProps<"img", ImageBaseProps>;

type Component = {
  (props: ImageProps): React.ReactElement | null;
  propTypes?: React.WeakValidationMap<ImageProps> | undefined;
  displayName?: string | undefined;
};

const allowedLayoutValues = [
  "fill",
  "fixed",
  "intrinsic",
  "responsive"
] as const;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const isStaticRequire = (src: { default: unknown }) =>
  src.default !== undefined;
const isStaticImageData = (src: { src: unknown }) => src.src !== undefined;

const isStaticImport = (src: unknown) =>
  typeof src === "object" &&
  (isStaticRequire(src as { default: unknown }) ||
    isStaticImageData(src as { src: unknown }));

const getInt = (x: unknown) =>
  typeof x === "number"
    ? x
    : typeof x === "string"
    ? parseInt(x, 10)
    : undefined;

const ImageBase = (props: ImageProps, ref: React.Ref<HTMLImageElement>) => {
  const {
    className,
    sizes,
    src: srcProp,
    width: widthProp,
    height: heightProp,
    layout: layoutProp,
    style = {},
    ...otherProps
  } = props;

  const {
    objectFit,
    objectPosition,
    width: widthStyle,
    height: heightStyle
  } = style;

  const layout = layoutProp || (sizes != null ? "responsive" : "intrinsic");

  let width = widthProp || widthStyle;
  let height = heightProp || heightStyle;

  let staticSrc = "";

  if (isStaticImport(srcProp)) {
    const staticImageData = (
      isStaticRequire(srcProp as { default: unknown })
        ? (srcProp as { default: unknown }).default
        : srcProp
    ) as { src?: string; width?: number; height?: number };

    if (!staticImageData.src) {
      throw new Error(
        "[Sonnat]: An object should only be passed to the image component src parameter if it comes from a static image import. " +
          "It must include src. " +
          `Received ${JSON.stringify(staticImageData)}`
      );
    }

    staticSrc = staticImageData.src;

    if (layout !== "fill") {
      if (!staticImageData.height || !staticImageData.width) {
        throw new Error(
          "[Sonnat]: An object should only be passed to the image component src parameter if it comes from a static image import. " +
            "It must include height and width. " +
            `Received ${JSON.stringify(staticImageData)}`
        );
      }

      height = height || staticImageData.height;
      width = width || staticImageData.width;
    }
  }

  const src = typeof srcProp === "string" ? srcProp : staticSrc;

  const widthInt = getInt(width);
  const heightInt = getInt(height);

  if (process.env.NODE_ENV !== "production") {
    if (!src) {
      throw new Error(
        '[Sonnat]: Image is missing required "src" property. ' +
          'Make sure you pass "src" in props to the `Image` component.'
      );
    }
    if (!allowedLayoutValues.includes(layout)) {
      throw new Error(
        `[Sonnat]: Image with src "${src}" has invalid \`layout\` property. ` +
          `Provided "${layout}" should be one of [${allowedLayoutValues
            .map(String)
            .join(", ")}].`
      );
    }
    if (typeof widthInt === "undefined" || typeof heightInt === "undefined") {
      throw new Error(
        `[Sonnat]: Image with src "${src}" has invalid \`width\` or \`height\` property. ` +
          "These should be numeric values."
      );
    }

    if (
      (typeof widthInt !== "undefined" && isNaN(widthInt)) ||
      (typeof heightInt !== "undefined" && isNaN(heightInt))
    ) {
      throw new Error(
        `[Sonnat]: Image with src "${src}" has invalid \`width\` or \`height\` property. ` +
          "These should be numeric values."
      );
    }
  }

  const [isImageLoaded, setImageLoaded] = React.useState(false);

  const [setIntersectionRef, isIntersected] = useIntersection<HTMLImageElement>(
    { rootMargin: "200px" }
  );
  const isVisible = isIntersected && isImageLoaded;

  React.useEffect(() => {
    const image = new window.Image();
    image.src = src;
    image.onload = () => {
      setImageLoaded(true);
    };
  }, [src]);

  const imgStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,

    boxSizing: "border-box",
    padding: 0,
    border: "none",
    margin: "auto",

    display: "block",
    width: 0,
    height: 0,
    minWidth: "100%",
    maxWidth: "100%",
    minHeight: "100%",
    maxHeight: "100%",

    objectFit,
    objectPosition
  };

  let wrapperStyle: React.CSSProperties = {};
  let sizerStyle: React.CSSProperties = {};
  let sizerSvg;

  if (
    typeof widthInt !== "undefined" &&
    typeof heightInt !== "undefined" &&
    layout !== "fill"
  ) {
    // <Image src="i.png" width="x" height="y" />
    const quotient = heightInt / widthInt;
    const paddingTop = isNaN(quotient) ? "100%" : `${quotient * 100}%`;

    if (layout === "responsive") {
      // <Image src="i.png" width="x" height="y" layout="responsive" />
      wrapperStyle = {
        display: "block",

        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        margin: 0
      };
      sizerStyle = {
        display: "block",
        boxSizing: "border-box",
        paddingTop
      };
    } else if (layout === "intrinsic") {
      // <Image src="i.png" width="100" height="100" layout="intrinsic" />
      wrapperStyle = {
        display: "inline-block",
        maxWidth: "100%",

        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        margin: 0
      };
      sizerStyle = {
        display: "block",
        boxSizing: "border-box",
        maxWidth: "100%"
      };
      sizerSvg = `<svg width="${widthInt}" height="${heightInt}" xmlns="http://www.w3.org/2000/svg" version="1.1"/>`;
    } else if (layout === "fixed") {
      // <Image src="i.png" width="100" height="100" layout="fixed" />
      wrapperStyle = {
        display: "inline-block",
        width: widthInt,
        height: heightInt,

        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box"
      };
    }
  } else if (
    typeof widthInt === "undefined" &&
    typeof heightInt === "undefined" &&
    layout === "fill"
  ) {
    // <Image src="i.png" layout="fill" />
    wrapperStyle = {
      display: "block",

      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,

      overflow: "hidden",
      boxSizing: "border-box",
      margin: 0
    };
  } else {
    // <Image src="i.png" />
    if (process.env.NODE_ENV !== "production") {
      throw new Error(
        `[Sonnat]: Image with src "${src}" must use \`width\` and \`height\` properties or \`layout='fill'\` property.`
      );
    }
  }

  return (
    <div className="SonnatImage-wrapper" style={wrapperStyle}>
      {!!sizerStyle && (
        <div className="SonnatImage-sizer" style={sizerStyle}>
          {!!sizerSvg && (
            <img
              className="SonnatImage-sizerSvg"
              style={{
                maxWidth: "100%",
                display: "block",
                margin: 0,
                border: "none",
                padding: 0
              }}
              alt=""
              aria-hidden={true}
              role="presentation"
              src={`data:image/svg+xml;base64,${toBase64(sizerSvg)}`}
            />
          )}
        </div>
      )}
      {!isVisible && (
        <React.Fragment>
          <Skeleton
            style={{
              zIndex: 1,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0
            }}
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ratio={widthInt! / heightInt!}
            variant="rectangular"
          />
          <noscript>
            <img
              {...otherProps}
              src={src}
              sizes={sizes}
              decoding="async"
              style={imgStyle}
              className={className}
            />
          </noscript>
        </React.Fragment>
      )}
      <img
        {...otherProps}
        src={src}
        sizes={sizes}
        decoding="async"
        style={{
          ...imgStyle,
          visibility: isVisible ? "visible" : "hidden"
        }}
        className={className}
        ref={node => {
          if (ref) setRef(ref, node);
          setIntersectionRef(node);
        }}
      />
    </div>
  );
};

const Image = React.forwardRef(ImageBase) as Component;

Image.propTypes = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  sizes: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  layout: PropTypes.oneOf(allowedLayoutValues)
};

export default Image;
