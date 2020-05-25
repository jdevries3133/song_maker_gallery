import { PREVIEW_GALLERY } from "../actions/types.js";

const initialState = {
  title: "",
  description: "",
  array: [],
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PREVIEW_GALLERY:
      return {
        ...state,
        title: action.title,
        description: action.description,
        array: action.array,
      };
    default:
      return state;
  }
}
