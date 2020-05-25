import { combineReducers } from "redux";
import galleries from "./galleries";
import preview from "./galleryPreview";

export default combineReducers({
  galleries,
  preview,
});
