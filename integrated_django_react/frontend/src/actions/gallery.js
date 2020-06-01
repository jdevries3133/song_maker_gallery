import axios from "axios";

import { GET_GALLERY } from "./types";

// GET Gallery
export const getGallery = (url_ext, token) => (dispatch) => {
  axios
    .get(`/api/galleries/get/${url_ext}/`, {
      headers: {
        Authorization: `Token ${token}`,
      },
    })
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
          status: err,
        },
      })
    );
};
