import axios from "axios";

import { GET_GALLERIES } from "./types";

// GET GALLERIES
export const getGalleries = () => (dispatch) => {
  axios
    .get("/api/galleries/")
    .then((res) => {
      dispatch({
        type: GET_LEADS,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};
