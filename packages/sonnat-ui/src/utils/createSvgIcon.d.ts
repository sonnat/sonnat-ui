import type { IconFC } from "../Icon";
import * as React from "react";

/**
 * Creates a react svg `Icon` component from the giving paths (`children`).
 *
 * @function createSvgIcon
 *
 * @param {React.ReactNode} children The content of the svg.
 * @param {string} name The `displayName` of the returned react component.
 *
 * @return {IconFC} Returns the react svg `Icon` component.
 */
export default function createSvgIcon(
  /* eslint-disable no-unused-vars */
  children: React.ReactNode,
  name: string
  /* eslint-enable no-unused-vars */
): IconFC;
