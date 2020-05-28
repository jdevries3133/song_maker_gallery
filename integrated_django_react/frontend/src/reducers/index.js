import { combineReducers } from "redux";
import galleries from "./galleries";
import user from "./user";

export default combineReducers({
  galleries,
  user,
});
