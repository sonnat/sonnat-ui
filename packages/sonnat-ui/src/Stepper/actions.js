export const types = {
  PREVENT_SUBTRACTION: "PREVENT_SUBTRACTION",
  PREVENT_ADDITION: "PREVENT_ADDITION",
  ALLOW_ADDITION_AND_SUBTRACTION: "ALLOW_ADDITION_AND_SUBTRACTION"
};

export const preventSubtraction = () => {
  return { type: types.PREVENT_SUBTRACTION };
};

export const preventAddition = () => {
  return { type: types.PREVENT_ADDITION };
};

export const allowAdditionAndSubtraction = () => {
  return { type: types.ALLOW_ADDITION_AND_SUBTRACTION };
};
