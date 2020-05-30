import { LOGIN, LOGOUT, REGISTER } from "../actions/types";

const initialState = {
  token: "",
  isAuthenticated: false,
  badCredentials: false,
  userData: {},
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
    default:
      return { ...state };
  }
}

// return { ...state, isAuthenticated: action.payload.isAuthenticated };
