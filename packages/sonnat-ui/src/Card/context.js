import { createContext } from "react";

const CardContext = createContext({ isImageCovered: false });

if (process.env.NODE_ENV !== "production")
  CardContext.displayName = "CardContext";

export default CardContext;
