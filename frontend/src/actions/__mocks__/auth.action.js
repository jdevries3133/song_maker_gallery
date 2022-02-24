import { LOGIN, REGISTER, CLEAR_ERROR, LOGOUT, UPDATE, DELETE } from "../types";

export const register = jest.fn().mockImplementation(() => (dispatch) => {
  dispatch({
    type: REGISTER,
    payload: {
      isAuthenticated: true,
      authError: false,
      token: "testtoken",
      user: "testuser",
    },
  });
});

export const clearError = jest.fn().mockImplementation(() => (dispatch) => {
  dispatch({
    type: CLEAR_ERROR,
    payload: {
      authError: false,
    },
  });
});

export const logout = jest.fn().mockImplementation(() => (dispatch) => {
  dispatch({
    type: LOGOUT,
  });
});

export const tryToken = jest.fn().mockImplementation(() => (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: {
      isAuthenticated: true,
      authError: false,
      token: "testtoken",
    },
  });
});

export const login = jest.fn().mockImplementation(() => (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: {
      isAuthenticated: true,
      authError: false,
      token: "testtoken",
    },
  });
});

export const updateUser = jest.fn().mockImplementation(() => (dispatch) => {
  dispatch({
    type: UPDATE,
    payload: {
      authError: false,
      token: "testtoken",
    },
  });
});

export const deleteAccount = jest.fn().mockImplementation(() => (dispatch) => {
  dispatch({
    type: DELETE,
    payload: {
      isAuthenticated: false,
      token: null,
    },
  });
});
