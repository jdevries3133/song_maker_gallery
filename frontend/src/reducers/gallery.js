import { GET_GALLERY } from "Actions/types";

const initialState = {
  gallery: { status: undefined },
  status: undefined,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_GALLERY:
      return {
        ...state,
        gallery: action.payload.gallery,
        status: action.payload.status,
      };
    default:
      return state;
  }
}
