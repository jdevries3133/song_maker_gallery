import { combineReducers } from "redux";
import galleries from "./galleries";
import { presentGallery, apiGallery } from "./galleryPreview";

export default combineReducers({
  galleries,
  presentGallery,
  apiGallery,
});
