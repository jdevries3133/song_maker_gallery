import axios from "axios";
import { POST_GALLERY } from "./types";

// POST GALLERY
export const postGallery = (form, token) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .post(
      "/api/user/",

      {
        title: form.title,
        description: form.description,
        api_obj: form.api_obj,
      },
      {
        headers: { Authorization: `Token ${token}` },
      }
    )
    .then((res) => {
      dispatch({
        type: POST_GALLERY,
        payload: {
          status: res.status,
          formPassthrough: null,
          gallery: res.data.url_extension,
        },
      });
    })
    .catch((err) => {
      dispatch({
        type: POST_GALLERY,
        payload: {
          status: 1,
          formPassthrough: form,
          gallery: null,
        },
      });
    });
};

export const getUserGalleries = (token) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .get("api/user", { headers: { Authorization: `Token ${token}` } })
    .then((res) => console.log(res))
    .catch((e) => {
      console.log(e);
    });
};
