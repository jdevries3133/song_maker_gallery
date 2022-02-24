import { DISMISS_NOTIFICATION } from "Actions/types";

function moreThanOneDayHasPassed(start, end) {
  const oneDayMilliseconds = 1000 * 60 * 60 * 24;
  return start - end > oneDayMilliseconds;
}

const lastDismissed =
  parseInt(localStorage.getItem("SERVICE_NOTICE_LAST_DISMISSED")) || 0;
const today = Date.now();

const initialState = {
  dismissed: moreThanOneDayHasPassed(today, lastDismissed) ? false : true,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case DISMISS_NOTIFICATION:
      return {
        ...state,
        dismissed: true,
      };
    default:
      return state;
  }
}
