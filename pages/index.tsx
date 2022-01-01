import * as React from "react";
import Divider from "../lib/Divider";
import Switch from "../lib/Switch";
import { AppContext } from "./_app";

const Page = () => {
  const context = React.useContext(AppContext);

  return (
    <div style={{ maxWidth: 500, margin: "100px auto" }}>
      <Switch
        label="Toggle Darkmode"
        onChange={isChecked => void context?.setIsDarkMode(isChecked)}
      />
      <br />
      <Divider spaced />
    </div>
  );
};

export default Page;
