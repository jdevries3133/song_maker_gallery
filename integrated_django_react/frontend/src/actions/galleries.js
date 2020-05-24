import axios from "axios";

import { GET_GALLERY, POST_GALLERY } from "./types";

// GET Gallery
export const getGallery = (url_ext) => (dispatch) => {
  axios
    .get(`/api/galleries/get/${url_ext}/`)
    .then((res) => {
      dispatch({
        type: GET_GALLERY,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// POST GALLERY
export const postGallery = (form) => (dispatch) => {
  axios
    .get("/api/galleries/post/")
    .then((res) => {
      dispatch({
        type: POST_GALLERY,
        payload: form,
      });
    })
    .catch((err) => console.log(err));
};
