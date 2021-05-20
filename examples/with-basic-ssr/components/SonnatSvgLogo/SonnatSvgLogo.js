import Icon from "@sonnat/ui/Icon";
import * as React from "react";

const componentName = "SonnatSvgLogo";

const SonnatSvgLogo = props => {
  return (
    <Icon {...props} viewBox="0 0 48 48" title="Sonnat Design System's Logo">
      <circle cx="24" cy="24" r="24" fill="#ea475b" />
      <rect
        x="9.6"
        y="9.6"
        width="28.8"
        height="28.8"
        fill="#fff"
        fillOpacity="0"
      />
      <path
        d="M33.46,32.49,21.18,35.94h0a3.79,3.79,0,0,1-3.9-.92l-3.56-3.56a.55.55,0,0,1,.23-.92l11-3a.7.7,0,0,1,.8.23l3.91,3.9a3.74,3.74,0,0,0,2.75,1.15A3.92,3.92,0,0,1,33.46,32.49Z"
        transform="translate(0 0)"
        fill="#e5e5e5"
        opacity="0.9"
        style={{ isolation: "isolate" }}
      />
      <path
        d="M35.19,26.07l-7.35-7.35-1.26-1.26h0a3.88,3.88,0,0,1,0-5.51h0A2.52,2.52,0,0,1,28.07,11L15.9,14.24a7.41,7.41,0,0,0-1.83,1,3.94,3.94,0,0,0,0,5.51l7.46,7.57,1.14,1.15a3.88,3.88,0,0,1,0,5.51h0a3.27,3.27,0,0,1-1.6.92l12.28-3.33h0a3.1,3.1,0,0,0,1.72-1,3.77,3.77,0,0,0,1.15-2.76A3.49,3.49,0,0,0,35.19,26.07Z"
        transform="translate(0 0)"
        fill="#f4f4f4"
        opacity="0.84"
        style={{ isolation: "isolate" }}
      />
      <path
        d="M32,12a3.76,3.76,0,0,0-3.9-.92h0L15.9,14.24c.35,0,.69-.11.92-.11a3.73,3.73,0,0,1,2.76,1.15h0l4,4a.76.76,0,0,0,.81.23l3.33-.91,8-2.07c.34-.12.46-.46.23-.69Z"
        transform="translate(0 0)"
        fill="#fff"
        opacity="0.9"
        style={{ isolation: "isolate" }}
      />
    </Icon>
  );
};

SonnatSvgLogo.displayName = componentName;

export default SonnatSvgLogo;
