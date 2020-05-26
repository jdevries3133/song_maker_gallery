import axios from "axios";

import { GET_GALLERY } from "./types";

// GET Gallery
export const getGallery = (url_ext) => (dispatch) => {
  console.log("ran ax");
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
