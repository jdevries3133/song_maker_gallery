import axios from "axios";

import { LOGIN, REGISTER, CLEAR_ERROR, LOGOUT } from "./types";
import { normalizeErrorMessage } from "./normalize_error_message";

/**
 * LOGIN that does not catch or handle an error response. This is for silently
 * trying a localStorage token in the background.
 */
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
      dispatch({
        type: LOGIN,
        payload: {
          isAuthenticated: false,
          authError: normalizeErrorMessage(e.response?.data, e.response.status),
          token: null,
        },
      });
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
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .post("/api/auth/register/", data)
    .then((res) => {
      dispatch({
        type: REGISTER,
        payload: {
          isAuthenticated: true,
          authError: false,
          token: res.data.token,
          user: res.data.user,
        },
      });
    })
    .catch((e) => {
      dispatch({
        type: REGISTER,
        payload: {
          isAuthenticated: false,
          authError: normalizeErrorMessage(e.response?.data, e.response.status),
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
    .catch((e) => {
      dispatch({
        type: REGISTER,
        payload: {
          authError: normalizeErrorMessage(e.response?.data, e.response.status),
        },
      });
    });
};

// TODO: implement for changing email/password
export const updateUser = (pk, data) => {
  throw new Error("Not implemented");
};

// TODO: implement
export const deleteAccount = (pk, username, password) => {
  throw new Error("Not implemented");
};
