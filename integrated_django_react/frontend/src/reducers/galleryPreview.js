import { PREVIEW_GALLERY, API_GALLERY } from "../actions/types.js";

const initialStatePreview = {
  title: "",
  description: "",
  array: [],
};

export const presentGallery = (state = initialStatePreview, action) => {
  switch (action.type) {
    case PREVIEW_GALLERY:
      return {
        ...state,
        title: action.title,
        description: action.description,
        array: action.array,
      };
    default:
      return state;
  }
};

const initialStateArr = {};

export const apiGallery = (state = initialStateArr, action) => {
  switch (action.type) {
    case API_GALLERY:
      console.log("ran");
      return {
        ...state,
        api_obj: [...state.api_obj, action.api_obj],
      };
    default:
      return state;
  }
};
