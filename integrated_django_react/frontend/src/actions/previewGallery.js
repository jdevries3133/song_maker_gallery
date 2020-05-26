import { PREVIEW_GALLERY, API_GALLERY } from "./types";

export const previewGallery = (title, description, array) => (dispatch) => {
  return {
    type: PREVIEW_GALLERY,
    title: title,
    description: description,
    array: array,
  };
};

export const apiGallery = (api_obj) => {
  console.log("ran2");
  return {
    type: API_GALLERY,
    api_obj,
  };
};
