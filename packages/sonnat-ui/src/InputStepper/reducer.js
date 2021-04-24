import { types } from "./actions";

export default (state, action) => {
  switch (action.type) {
    case types.PREVENT_ADDITION:
      return { ...state, addition: false };
    case types.PREVENT_SUBTRACTION:
      return { ...state, subtraction: false };
    case types.ALLOW_ADDITION_AND_SUBTRACTION:
      return { subtraction: true, addition: true };
  }
};
