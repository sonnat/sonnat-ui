import * as React from "react";
import { ButtonProps, ButtonTypeMap } from "../../Button";
import { OverridableComponent } from "../../utils/typings/OverridableComponent";

export type CardActionProps<
  P = {},
  N extends React.ElementType = "button"
> = ButtonProps<P, N>;

declare const CardAction: OverridableComponent<ButtonTypeMap<{}, "button">>;

export default CardAction;
