import { combineReducers } from "redux";
import gallery from "./gallery";
import user from "./user";
import auth from "./auth.reducer";

export default combineReducers({
  gallery,
  user,
  auth,
});
