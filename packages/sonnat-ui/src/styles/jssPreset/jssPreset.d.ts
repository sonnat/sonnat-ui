import { JssOptions } from "jss";

export type JssPreset = Pick<JssOptions, "plugins">;

export default function jssPreset(): JssPreset;
