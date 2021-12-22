import PropTypes from "prop-types";
import * as React from "react";
import useTheme from "../styles/useTheme";
import useIsomorphicLayoutEffect from "../utils/useIsomorphicLayoutEffect";
import useStyles from "./styles";

export interface CssBaselineProps {
  children?: React.ReactNode;
}

const CssBaseline = (props: CssBaselineProps): JSX.Element => {
  useStyles();

  const theme = useTheme();

  useIsomorphicLayoutEffect(() => {
    document.body.dir = theme.direction;
  }, [theme.direction]);

  return <React.Fragment>{props.children}</React.Fragment>;
};

CssBaseline.propTypes = {
  children: PropTypes.node
};

export default CssBaseline;
