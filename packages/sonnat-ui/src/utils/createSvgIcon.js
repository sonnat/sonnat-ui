import * as React from "react";
import SonnatIcon from "../Icon";

export default function createSvgIcon(children, name) {
  const Icon = React.forwardRef((props, ref) => (
    <SonnatIcon viewBox="0 0 24 24" ref={ref} {...props}>
      {children}
    </SonnatIcon>
  ));

  Icon.displayName = `${name}Icon`;

  return Icon;
}
