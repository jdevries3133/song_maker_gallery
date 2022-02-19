import { DISMISS_NOTIFICATION } from "./types";

export const dismissNotice = () => (dispatch) => {
  localStorage.setItem("SERVICE_NOTICE_LAST_DISMISSED", Date.now().toString());
  dispatch({
    type: DISMISS_NOTIFICATION,
  });
};
