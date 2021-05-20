import ArrowRight from "@sonnat/icons/ArrowRight";
import Code from "@sonnat/ui/Code";
import Column from "@sonnat/ui/Column";
import Container from "@sonnat/ui/Container";
import Divider from "@sonnat/ui/Divider";
import Row from "@sonnat/ui/Row";
import makeStyles from "@sonnat/ui/styles/makeStyles";
import Text from "@sonnat/ui/Text";
import React from "react";
import SonnatSvgLogo from "../components/SonnatSvgLogo";

const useStyles = makeStyles(
  theme => {
    const {
      colors,
      breakpoints,
      typography: { pxToRem }
    } = theme;

    return {
      root: {
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      },
      wrapper: {
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center"
      },
      container: {
        paddingLeft: pxToRem(16),
        marginLeft: pxToRem(16),
        borderLeft: `1px solid ${colors.divider}`
      },
      link: {
        textDecoration: "none"
      },
      card: {
        textAlign: "left",
        marginTop: pxToRem(16),
        border: `1px solid ${colors.divider}`,
        padding: pxToRem(16),
        borderRadius: pxToRem(4),
        cursor: "pointer",
        transition: "border-color 360ms ease",
        "&:hover": {
          borderColor: colors.primary.origin,
          "& > $cardTitle": {
            color: colors.primary.origin
          },
          "& > $cardDescription": {
            color: colors.primary.origin
          }
        }
      },
      cardTitle: {
        display: "flex",
        alignItems: "center",
        color: colors.text.primary,
        marginBottom: pxToRem(8),
        transition: "color 360ms ease"
      },
      cardDescription: {
        color: colors.text.secondary,
        transition: "color 360ms ease"
      },
      mit: {
        display: "flex",
        alignItems: "center",
        marginTop: pxToRem(16)
      },
      divider: {
        marginLeft: pxToRem(8),
        marginRight: pxToRem(8),
        marginTop: pxToRem(4),
        marginBottom: pxToRem(4)
      },
      [breakpoints.down("sm")]: {
        wrapper: {
          flexDirection: "column",
          alignItems: "center"
        },
        container: {
          paddingLeft: 0,
          marginLeft: 0,
          marginTop: pxToRem(16),
          borderLeft: "none",
          textAlign: "center"
        },
        mit: {
          justifyContent: "center"
        }
      }
    };
  },
  { name: "App" }
);

export default function Home() {
  const classes = useStyles();

  // remove the style tag used by Critical CSS rendered in SSR
  React.useEffect(() => {
    const jssServerStyles = document.getElementById("sonnat-jss-ssr");

    if (jssServerStyles)
      jssServerStyles.parentElement.removeChild(jssServerStyles);
  }, []);

  return (
    <main id="main">
      <Container>
        <Row>
          <Column sm={{ size: 10, offset: 1 }}>
            <article className={classes.root}>
              <div className={classes.wrapper}>
                <SonnatSvgLogo size={64} />
                <div className={classes.container}>
                  <header>
                    <Text rootNode="h1" variant="h3">
                      Welcome to Sonnat!
                    </Text>
                  </header>
                  <Text variant="bodySmall">
                    Using <Code>{`@sonnat/ui`}</Code> with NextJS.
                  </Text>
                  <a
                    className={classes.link}
                    href="https://www.sonnat.dev"
                    title="Sonnat-UI's Documentation"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <div className={classes.card}>
                      <Text
                        className={classes.cardTitle}
                        rootNode="strong"
                        variant="subtitle"
                      >
                        Documentation <ArrowRight size={20} />
                      </Text>
                      <Text
                        className={classes.cardDescription}
                        rootNode="p"
                        variant="bodySmall"
                      >
                        Find in-depth information about{" "}
                        <Code>{`@sonnat/ui`}</Code> features and API.
                      </Text>
                    </div>
                  </a>
                  <div className={classes.mit}>
                    <Text variant="caption" color="textSecondary">
                      Under the MIT License
                    </Text>
                    <Divider className={classes.divider} vertical />
                    <Text
                      rootNode="a"
                      color="primary"
                      title="Sonnat-UI's Github"
                      href="https://github.com/sonnat/sonnat-ui"
                      rel="noopener noreferrer"
                      target="_blank"
                      variant="caption"
                    >
                      Github
                    </Text>
                  </div>
                </div>
              </div>
            </article>
          </Column>
        </Row>
      </Container>
    </main>
  );
}
