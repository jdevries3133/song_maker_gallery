import axios from "axios";

import { LOGIN, REGISTER, CLEAR_ERROR, LOGOUT } from "./types";

export const tryToken = (token) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .get("/api/auth/login/", {
      headers: { Authorization: `Token ${token}` },
    })
    .then(() => {
      dispatch({
        type: LOGIN,
        payload: {
          isAuthenticated: true,
          authError: false,
          token: token,
        },
      });
    })
    .catch((e) => console.log(e));
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
            authError: e.response.data,
            token: null,
          },
        });
      } else {
        // server error
        // TODO: error handling
      }
    });
};

export const clearError = () => (dispatch) => {
  dispatch({
    type: CLEAR_ERROR,
    payload: {
      authError: false,
    },
  });
};

export const register = (data) => (dispatch) => {
  // TODO: error handling
  // I don't think 500 errors are being handled properly here
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
          authError: e.response.data,
          token: null,
          user: null,
        },
      });
    });
};

// LOGOUT
export const logout = (token) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .post("/api/auth/logout/", null, {
      headers: { Authorization: `Token ${token}` },
    })
    .then(() => {
      dispatch({
        type: LOGOUT,
      });
    })
    .catch((e) => console.log(e));
};
