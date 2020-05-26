import axios from "axios";
import { POST_GALLERY } from "./types";
// POST GALLERY
export const postGallery = (form) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .post("/api/galleries/post/", {
      title: form.title,
      description: form.description,
      api_obj: form.api_obj,
    })
    .then((res) => {
      console.log(res);
      dispatch({
        type: POST_GALLERY,
        payload: {
          response: res,
          formPassthrough: form,
        },
      });
    })
    .catch((err) => console.log(err));
};
