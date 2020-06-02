import { LOGIN, LOGOUT, REGISTER, CLEAR_ERROR } from "../actions/types";

const initialState = {
  token: "",
  isAuthenticated: false,
  authErrr: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        authError: action.payload.authError,
        token: action.payload.token,
        user: action.payload.user,
      };
    case LOGOUT:
      return { ...state };
    case REGISTER:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        authError: action.payload.authError,
        token: action.payload.token,
        user: action.payload.user,
      };
    case CLEAR_ERROR:
      return {
        ...state,
        authError: action.payload.authError,
      };
    default:
      return { ...state };
  }
}
