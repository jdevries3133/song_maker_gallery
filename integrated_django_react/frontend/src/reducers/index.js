import { combineReducers } from "redux";
import gallery from "./gallery";
import user from "./user";

export default combineReducers({
  gallery,
  user,
});
