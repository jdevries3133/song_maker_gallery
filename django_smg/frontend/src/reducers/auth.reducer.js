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
        authErr: false,
      };
    default:
      return { ...state };
  }
}
