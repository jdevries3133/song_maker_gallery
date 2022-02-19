import { combineReducers } from "redux";
import gallery from "./gallery";
import user from "./user";
import auth from "./auth.reducer";
import serviceState from "./service_interrupt";

export default combineReducers({
  gallery,
  user,
  auth,
  serviceState,
});
