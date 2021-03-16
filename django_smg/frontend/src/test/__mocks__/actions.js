/**
 * Mock redux actions which also conveniently avoid network calls
 */

import { GET_GALLERY } from "../../actions/types";

const galleryFound = () => (dispatch) => {
  dispatch({
    type: GET_GALLERY,
    payload: {
      gallery: {
        title: "Test Gallery",
        slug: "test-gallery",
        description: "description",
        songData: [],
      },
      status: 200,
    },
  });
};

const galleryNotFound = () => (dispatch) => {
  dispatch({
    type: GET_GALLERY,
    payload: {
      status: 404,
    },
  });
};

const galleryActionCustom = ({
  title,
  slug,
  description,
  songData,
  statusCode,
}) => (dispatch) => {
  dispatch({
    type: GET_GALLERY,
    payload: {
      gallery: {
        title: "Test Gallery",
        slug: "test-gallery",
        description: "description",
        songData: [],
      },
      status: 200,
    },
  });
};

export const mockGetGallery = (result) => {
  switch (result) {
    case "FOUND":
      return galleryFound;
    case "NOT_FOUND":
      return galleryNotFound;
    case "CUSTOM":
      return galleryActionCustom;
    default:
      throw new Error(`${result} is not a valid choice.`);
  }
};
