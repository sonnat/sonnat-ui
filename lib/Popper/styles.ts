import makeStyles from "../styles/makeStyles";

const useStyles = makeStyles(
  ({ zIndexes }) => ({
    root: {
      opacity: 0,
      visibility: "hidden",
      zIndex: zIndexes.popover,
      transition: ["opacity 240ms ease", "visibility 240ms ease"].join(",")
    },
    open: { opacity: 1, visibility: "visible" },
    absolute: { position: "absolute" },
    fixed: { position: "fixed" }
  }),
  { name: "SonnatPopper" }
);

export default useStyles;
