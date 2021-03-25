import axios from "axios";

import { GET_GALLERY } from "./types";

// GET Gallery
export const getGallery = (slug) => (dispatch) => {
  axios
    .get(`/api/gallery/public/${slug}/`)
    .then((res) => {
      dispatch({
        type: GET_GALLERY,
        payload: {
          gallery: res.data,
          status: res.status,
        },
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_GALLERY,
        payload: {
          gallery: null,
          status: err.response.status,
        },
      })
    );
};
