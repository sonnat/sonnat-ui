// Based on the next/image package (https://github.com/vercel/next.js/blob/canary/packages/next/client/image.tsx)
import React from "react";
import PropTypes from "prop-types";
import Skeleton from "../Skeleton";
import useIntersection from "../utils/useIntersection";

const componentName = "Image";

const VALID_LAYOUT_VALUES = ["fill", "fixed", "intrinsic", "responsive"];

const toBase64 = str =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const isStaticRequire = src => src.default !== undefined;
const isStaticImageData = src => src.src !== undefined;

const isStaticImport = src =>
  typeof src === "object" && (isStaticRequire(src) || isStaticImageData(src));

const getInt = x =>
  typeof x === "number"
    ? x
    : typeof x === "string"
    ? parseInt(x, 10)
    : undefined;

const Image = React.memo(
  React.forwardRef(function Image(props, ref) {
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

    const { objectFit, objectPosition, widthStyle, heightStyle } = style;

    const layout = layoutProp || (sizes != null ? "responsive" : "intrinsic");

    let width = widthProp || widthStyle;
    let height = heightProp || heightStyle;

    let staticSrc = "";

    if (isStaticImport(srcProp)) {
      const staticImageData = isStaticRequire(srcProp)
        ? srcProp.default
        : srcProp;

      if (!staticImageData.src) {
        throw new Error(
          "[Sonnat]: An object should only be passed to the image component src parameter if it comes from a static image import. " +
            "It must include src. " +
            `Received ${JSON.stringify(staticImageData)}`
        );
      }

      staticSrc = staticImageData.src;

      if (layout !== "fill") {
        height = height || staticImageData.height;
        width = width || staticImageData.width;

        if (!staticImageData.height || !staticImageData.width) {
          throw new Error(
            "[Sonnat]: An object should only be passed to the image component src parameter if it comes from a static image import. " +
              "It must include height and width. " +
              `Received ${JSON.stringify(staticImageData)}`
          );
        }
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
      if (!VALID_LAYOUT_VALUES.includes(layout)) {
        throw new Error(
          `[Sonnat]: Image with src "${src}" has invalid \`layout\` property. ` +
            `Provided "${layout}" should be one of [${VALID_LAYOUT_VALUES.map(
              String
            ).join(", ")}].`
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

    const [setRef, isIntersected] = useIntersection("200px");
    const isVisible = isIntersected && isImageLoaded;

    React.useEffect(() => {
      const image = new window.Image();
      image.src = src;
      image.onload = () => {
        setImageLoaded(true);
      };
    }, [src]);

    const imgStyle = {
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

    let wrapperStyle;
    let sizerStyle;
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
              ratio={widthInt / heightInt}
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
            if (ref) ref.current = node;
            setRef(node);
          }}
        />
      </div>
    );
  })
);

Image.displayName = componentName;

Image.propTypes = {
  src: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  sizes: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  layout: PropTypes.oneOf(VALID_LAYOUT_VALUES)
};

export default Image;
