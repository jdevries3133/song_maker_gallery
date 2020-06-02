import { POST_GALLERY, DELETE_GALLERY, GET_GALLERIES } from "../actions/types";

const initialState = {
  authenticated: false,
  galleries: [],
  galleryPostStatus: null,
  formPassthrough: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case POST_GALLERY:
      let newState;
      if (action.payload.gallery) {
        newState = {
          ...state,
          galleryPostStatus: action.payload.status,
          galleries: [...state.galleries, action.payload.gallery],
          postRequestMade: true,
          formPassthrough: null,
        };
      } else {
        newState = {
          ...state,
          galleryPostStatus: action.payload.status,
          formPassthrough: action.payload.formPassthrough,
        };
      }
      return newState;

    case GET_GALLERIES:
      return {
        ...state,
        galleries: action.payload.galleries,
      };

    case DELETE_GALLERY:
      if (action.payload.status === "deleted") {
        return {
          ...state,
          loopback: action.payload.loopback,
          deleteStatus: "deleted",
        };
      } else
        return {
          ...state,
          loopback: null,
          deleteStatus: "error",
        };
    default:
      return state;
  }
}
