import { POST_GALLERY, DELETE_GALLERY } from "../actions/types";

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

    case DELETE_GALLERY:
      return {
        ...state,
      };
    default:
      return state;
  }
}
