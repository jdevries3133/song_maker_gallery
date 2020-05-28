import axios from "axios";
import { POST_GALLERY } from "./types";

// POST GALLERY
export const postGallery = (form) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .post("/api/auth/", {
      title: form.title,
      description: form.description,
      api_obj: form.api_obj,
    })
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
