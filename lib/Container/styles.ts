import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  theme => {
    const {
      breakpoints,
      direction,
      spacings: { gutter },
      typography: { fontFamily }
    } = theme;

    return {
      root: {
        direction,
        fontFamily: fontFamily[direction],
        width: "100%",
        paddingRight: gutter,
        paddingLeft: gutter,
        marginRight: "auto",
        marginLeft: "auto",
        [breakpoints.up("xxs")]: {
          maxWidth: "100%",
          "&$xxsFluid": { extend: "fluid" }
        },
        [breakpoints.up("xs")]: {
          "&$xsFluid": { extend: "fluid" }
        },
        [breakpoints.up("sm")]: {
          maxWidth: breakpoints.values["sm"],
          "&$smFluid": { extend: "fluid" }
        },
        [breakpoints.up("md")]: {
          "&$mdFluid": { extend: "fluid" }
        },
        [breakpoints.up("lg")]: {
          maxWidth: breakpoints.values["md"],
          "&$lgFluid": { extend: "fluid" }
        },
        [breakpoints.up("xlg")]: {
          maxWidth: 1184,
          "&$xlgFluid": { extend: "fluid" }
        }
      },
      fluid: { maxWidth: "100%" },
      noPadding: { paddingRight: 0, paddingLeft: 0 },
      xxsFluid: {},
      xsFluid: {},
      smFluid: {},
      mdFluid: {},
      lgFluid: {},
      xlgFluid: {}
    };
  },
  { name: "SonnatContainer" }
);

export default useStyles;
