import * as React from "react";
import SonnatIcon, { IconProps } from "../Icon";

const createSvgIcon = (
  children: React.ReactNode,
  name: string
): React.FC<IconProps> => {
  const IconBase = (props: IconProps, ref: IconProps["ref"]) => (
    <SonnatIcon viewBox="0 0 24 24" ref={ref} {...props}>
      {children}
    </SonnatIcon>
  );

  const Icon = React.forwardRef(IconBase) as React.FC<IconProps>;

  Icon.displayName = `Sonnat${name}Icon`;

  return Icon;
};

export default createSvgIcon;
