import axios from "axios";

import { LOGIN, REGISTER, CLEAR_ERROR } from "./types";

export const useToken = (token) => (dispatch) => {
  dispatch({
    type: LOGIN,
    payload: {
      isAuthenticated: true,
      authError: false,
      token: token,
    },
  });
};

// LOGIN
// data must be {username: str, password: str}
export const login = (data) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .post("/api/auth/login/", data)
    .then((res) => {
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        dispatch({
          type: LOGIN,
          payload: {
            isAuthenticated: true,
            authError: false,
            token: res.data.token,
          },
        });
      } else {
        dispatch({
          type: LOGIN,
          payload: {
            isAuthenticated: false,
            authError: true,
            token: null,
          },
        });
      }
    })
    .catch((e) => {
      if (e.response.status === 400) {
        // wrong username or password
        dispatch({
          type: LOGIN,
          payload: {
            isAuthenticated: false,
            authError: true,
            token: null,
          },
        });
      } else {
        // server error
      }
    });
};

export const clearError = (data) => (dispatch) => {
  dispatch({
    type: CLEAR_ERROR,
    payload: {
      authError: false,
    },
  });
};

// data must be {username: str, password: str}
export const register = (data) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .post("/api/auth/register/", data)
    .then((res) => {
      if (res.status === 200) {
        dispatch({
          type: REGISTER,
          payload: {
            isAuthenticated: true,
            authError: false,
            token: res.data.token,
            user: res.data.user,
          },
        });
      } else {
        dispatch({
          type: REGISTER,
          payload: {
            isAuthenticated: false,
            authError: true,
            token: null,
            user: null,
          },
        });
      }
    })
    .catch((e) => {
      dispatch({
        type: REGISTER,
        payload: {
          isAuthenticated: false,
          authError: true,
          token: null,
          user: null,
        },
      });
    });
};

// LOGOUT
