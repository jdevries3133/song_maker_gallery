import { GET_GALLERY, POST_GALLERY } from "../actions/types.js";

const initialState = {
  galleries: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_GALLERY:
      return {
        ...state,
        galleries: [...state.galleries, action.payload],
      };
    case POST_GALLERY:
      return {
        ...state,
        galleries: [...state.galleries, action.payload],
      };
    default:
      return state;
  }
}
