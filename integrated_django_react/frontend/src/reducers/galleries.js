import { GET_GALLERY } from "../actions/types.js";

const initialState = {
  galleries: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_LEADS:
      return {
        ...state,
        galleries: action.payload,
      };
    default:
      return state;
  }
}
