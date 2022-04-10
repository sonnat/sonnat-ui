import {
  queries,
  Queries,
  render as testingLibraryRender,
  RenderOptions,
  RenderResult
} from "@testing-library/react/pure";
import * as React from "react";
import CssBaseline from "../../lib/CssBaseline";
import { SonnatInitializer } from "../../lib/styles";

const render = <
  Q extends Queries = typeof queries,
  Container extends Element | DocumentFragment = HTMLElement
>(
  ui: React.ReactElement,
  options: RenderOptions<Q, Container> = {}
): RenderResult<Q, Container> => {
  return testingLibraryRender(
    <SonnatInitializer>
      <CssBaseline />
      {ui}
    </SonnatInitializer>,
    options
  );
};

export default render;
