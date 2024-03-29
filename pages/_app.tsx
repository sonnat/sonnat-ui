import { AppProps } from "next/app";
import Head from "next/head";
import * as React from "react";
import CssBaseline from "../lib/CssBaseline";
import { makeStyles, SonnatInitializer, useDarkMode } from "../lib/styles";

interface IAppContext {
  setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export const AppContext = React.createContext<IAppContext | undefined>(
  undefined
);

const googleFontFamily =
  "https://fonts.googleapis.com/css2?" +
  "family=Roboto+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&" +
  "family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&" +
  "display=swap";

const useGlobalStyles = makeStyles(
  {
    "@global": {
      "html, body": { scrollBehavior: "smooth" },
      img: { verticalAlign: "middle" }
    }
  },
  { name: "GlobalStyles" }
);

const App = (props: AppProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { Component: Page, pageProps } = props;

  useGlobalStyles();

  React.useEffect(() => {
    const sonnatServerStyles = document.getElementById("sonnat-jss-ssr");

    if (sonnatServerStyles)
      sonnatServerStyles.parentElement?.removeChild(sonnatServerStyles);
  }, []);

  const [isDarkMode, setIsDarkMode] = React.useState(false);

  const newTheme = useDarkMode(isDarkMode);

  return (
    <SonnatInitializer theme={newTheme} injectFirst>
      <Head>
        <meta
          name="viewport"
          content="initial-scale=1.0, width=device-width, maximum-scale=5.0, minimum-scale=1.0"
          key="viewport"
        />
        <link rel="preload" as="style" href={googleFontFamily} />
        <link rel="stylesheet" href={googleFontFamily} />
      </Head>
      <div id="main-wrapper">
        <CssBaseline />
        <AppContext.Provider value={{ setIsDarkMode }}>
          <Page {...pageProps} />
        </AppContext.Provider>
      </div>
    </SonnatInitializer>
  );
};

export default App;
