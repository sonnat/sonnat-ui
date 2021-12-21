import { types, Action } from "./actions";

type Reducer = (
  state: { addition: boolean; subtraction: boolean },
  action: Action
) => { addition: boolean; subtraction: boolean };

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case types.PREVENT_ADDITION:
      return { ...state, addition: false };
    case types.PREVENT_SUBTRACTION:
      return { ...state, subtraction: false };
    case types.ALLOW_ADDITION_AND_SUBTRACTION:
      return { subtraction: true, addition: true };
    default:
      return state;
  }
};

export default reducer;
