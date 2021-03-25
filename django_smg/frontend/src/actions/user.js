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
    .catch((e) => {
      dispatch({
        type: POST_GALLERY,
        payload: {
          status: 1,
          formPassthrough: form,
          gallery: null,
          serverErrorMessage: e.response?.data || {
            "Server Error": [
              `Error Message: ${e.response.statusText}`,
              `Status Code: ${e.response.status}`,
            ],
          },
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
      dispatch({
        type: GET_GALLERIES,
        payload: {
          serverErrorMessage: e.response?.data || {
            "Server Error": [
              `Error Message: ${err.response.statusText}`,
              `Status Code: ${err.response.status}`,
            ],
          },
        },
      });
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
    })
    .then((response) => {
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
    .catch(() => {
      dispatch({
        type: DELETE_GALLERY,
        payload: { status: "error" },
      });
    });
};

/* Must remove "deleted" status from redux state after user acknowledgement */
export const acknowledgeDelete = () => (dispatch) => {
  dispatch({
    type: DELETE_GALLERY,
    payload: { status: "delete_acknowledged" },
  });
};
