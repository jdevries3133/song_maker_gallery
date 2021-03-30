import { LOGIN, LOGOUT, REGISTER, CLEAR_ERROR } from "Actions/types";

const initialState = {
  token: "",
  isAuthenticated: false,
  authError: false,
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
    case LOGOUT:
      return {
        ...state,
        token: "",
        isAuthenticated: false,
        authError: false,
      };
    default:
      return { ...state };
  }
}
