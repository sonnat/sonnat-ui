import React from "react";
import makeStyles from "@sonnat/ui/dist/styles/makeStyles";
import { changeColor } from "@sonnat/ui/dist/styles/colorUtils";
import Switch from "@sonnat/ui/dist/Switch";
import GlobalContext from "./GlobalContext";

const useStyles = makeStyles(
  theme => {
    const { colors } = theme;

    return {
      root: {
        maxWidth: "500px",
        paddingTop: 64,
        marginRight: "auto",
        marginLeft: "auto",
        height: "100vh"
      },
      container: {
        height: "100%",
        paddingTop: 16
      },
      heading: {
        display: "flex",
        alignItems: "center",
        maxWidth: "500px",
        margin: "0 auto",
        height: 64,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: theme.zIndexes.header,
        padding: [[0, 16]],
        backgroundColor: changeColor(colors.background.origin, { alpha: 0.98 }),
        borderBottom: `1px solid ${colors.divider}`
      }
    };
  },
  { name: `App` }
);

export default function App() {
  const localClass = useStyles();

  const { isDarkMode, setDarkMode } = React.useContext(GlobalContext);

  // remove the style tag used by Critical CSS rendered in SSR
  React.useEffect(() => {
    const jssServerStyles = document.getElementById("sonnat-jss-ssr");

    if (jssServerStyles)
      jssServerStyles.parentElement.removeChild(jssServerStyles);
  }, []);

  return (
    <React.Fragment>
      <div className={localClass.heading}>
        <Switch
          inputProps={{ id: "darkmode-switch" }}
          size="small"
          label="Dark mode"
          checked={isDarkMode}
          onChange={() => {
            setDarkMode(!isDarkMode);
          }}
        />
      </div>
      <div className="App">
        <div className={localClass.root}>
          <div className={localClass.container}></div>
        </div>
      </div>
    </React.Fragment>
  );
}
