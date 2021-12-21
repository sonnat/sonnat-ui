export type Action =
  | { type: "PREVENT_SUBTRACTION" }
  | { type: "PREVENT_ADDITION" }
  | { type: "ALLOW_ADDITION_AND_SUBTRACTION" };

export const types: Record<Action["type"], string> = {
  PREVENT_SUBTRACTION: "PREVENT_SUBTRACTION",
  PREVENT_ADDITION: "PREVENT_ADDITION",
  ALLOW_ADDITION_AND_SUBTRACTION: "ALLOW_ADDITION_AND_SUBTRACTION"
};

export const preventSubtraction = (): { type: "PREVENT_SUBTRACTION" } => {
  return { type: "PREVENT_SUBTRACTION" };
};

export const preventAddition = (): { type: "PREVENT_ADDITION" } => {
  return { type: "PREVENT_ADDITION" };
};

export const allowAdditionAndSubtraction = (): {
  type: "ALLOW_ADDITION_AND_SUBTRACTION";
} => {
  return { type: "ALLOW_ADDITION_AND_SUBTRACTION" };
};
