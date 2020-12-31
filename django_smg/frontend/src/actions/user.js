import axios from "axios";
import { POST_GALLERY, GET_GALLERIES, DELETE_GALLERY } from "./types";

// POST GALLERY
export const postGallery = (form, token) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .post(
      "/api/gallery/",
      {
        title: form.title,
        description: form.description,
        songData: form.songData,
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
          gallery: res.data,
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

// GET_GALLERIES
export const getUserGalleries = (token) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .get("/api/gallery/", {
      // this endpoint no longer exists and I think I'd like to depricate it in favor of more focused requests.
      headers: { Authorization: `Token ${token}` },
    })
    .then((res) =>
      dispatch({
        type: GET_GALLERIES,
        payload: {
          galleries: res.data,
        },
      })
    )
    .catch((e) => {
      console.log(e);
    });
};

// DELETE_GALLERY
export const deleteGallery = (pk, token) => (dispatch) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  axios
    .delete(`/api/gallery/?pk=${pk}`, {
      headers: {
        Authorization: `Token ${token}`,
      },
      data: {
        pk: pk,
      },
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        dispatch({
          type: DELETE_GALLERY,
          payload: { loopback: response.data, status: "deleted" },
        });
      } else if (response.data.error) {
        dispatch({
          type: DELETE_GALLERY,
          payload: { status: "error" },
        });
      }
    })
    .catch((e) => {
      console.log(e);
      dispatch({
        type: DELETE_GALLERY,
        payload: { status: "error" },
      });
    });
};
