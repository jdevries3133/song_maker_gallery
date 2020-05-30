import axios from "axios";

import { LOGIN, LOGOUT, REGISTER } from "./types";

// LOGIN
export const login = (data) => (dispatch) => {
  console.log(data);
  axios
    .post("api/auth/register/", data)
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
          isAuthenticated: false,
          authError: true,
          token: null,
          user: null,
        });
      }
    })
    .catch((e) => console.log(e.data));
};

export const register = (data) => (dispatch) => {
  // props.history.push teacher page
  axios
    .post("api/auth/register/", data)
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
    .catch((e) => console.log(e));
};

// LOGOUT
// REGISTER
