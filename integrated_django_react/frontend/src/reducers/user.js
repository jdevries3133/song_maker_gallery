import { POST_GALLERY } from "../actions/types";

const initialState = {
  authenticated: false,
}

export default function (state=initialState, action) {
  switch (action.type) {
    case POST_GALLERY:
      return {
        ...state,
        response: action.payload.response,
        formPassthrough: action.payload.formPassthrough
        // galleries: [...state.galleries, action.payload]
      }
    case DELETE_GALLERY {
      return {
        ...state,
        galleries: action.galleries
      }
    }
  }
}