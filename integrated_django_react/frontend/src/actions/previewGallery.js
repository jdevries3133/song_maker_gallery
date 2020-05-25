import { PREVIEW_GALLERY } from "./types";

export const previewGallery = (title, description, array) => (dispatch) => {
  console.log("dispatched");
  console.log(title, description, array);
  dispatch({
    type: PREVIEW_GALLERY,
    title: title,
    description: description,
    array: array,
  });
};
