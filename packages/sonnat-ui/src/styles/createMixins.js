export default (mixins, options) => {
  const { pxToRem } = options;

  return {
    useDisableUserSelect: () => ({
      WebkitUserSelect: "none",
      MozUserSelect: "none",
      MsUserSelect: "none",
      KhtmlUserSelect: "none",
      userSelect: "none",
      WebkitTouchCallout: "none",
      MsTouchAction: "pan-y",
      touchAction: "pan-y",
      WebkitTapHighlightColor: "transparent"
    }),
    useIconWrapper: size => {
      const sizing =
        size != null
          ? {
              width: pxToRem(size),
              height: pxToRem(size),
              minWidth: pxToRem(size),
              minHeight: pxToRem(size),
              fontSize: pxToRem(size)
            }
          : {};

      return {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...sizing
      };
    },
    usePreserveAspectRatio: (ratio = "1:1") => {
      let w, h;

      if (ratio === "golden") {
        w = 1 / 0.618034;
        h = 1;
      } else if (ratio.indexOf(":") > 0) {
        [w, h] = ratio.split(":");

        w = parseInt(w);
        h = parseInt(h);

        if (isNaN(w) || isNaN(h)) return {};
      } else return {};

      return {
        width: "100%",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        "&:after": {
          content: '""',
          height: 0,
          display: "block",
          paddingTop: `${100 / (w / h)}%`
        },
        "@global > .content-in-ratio": {
          position: "absolute",
          width: "100%",
          height: "100%"
        },
        "@global > img.content-in-ratio": {
          position: "absolute",
          width: "100%",
          height: "auto"
        }
      };
    },
    ...mixins
  };
};
