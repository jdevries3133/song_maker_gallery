import axios from "axios";
import store from "../../../store";

/* send new state to the backend via patch request */
const backendToggle = (slug, key, value) => {
  /* convert frontend keys to backend keys */
  const keyNameMap = (key) => {
    const map = {
      allowStudentSubmissions: "is_editable",
      isGalleryPublished: "is_public",
    };
    return map[key];
  };
  const state = store.getState();
  if (state.auth.isAuthenticated) {
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios.patch(
      "/api/gallery/settings/",
      { slug, [keyNameMap(key)]: value },
      { headers: { Authorization: `Token ${state.auth.token}` } }
    );
  } else {
    console.error(
      "Could not send update because user is not authenticated in redux state"
    );
  }
};

/**
 * "checked" is the state of the checkbox
 * "enabled" indicates whether the config item appears to the user at all
 */
export const types = { TOGGLE: "TOGGLE", DISABLE: "DISABLE", ENABLE: "ENABLE" };
export const configItemReducer = (state, action) => {
  switch (action.type) {
    case types.TOGGLE:
      backendToggle(state.slug, action.id, !state[action.id].checked);
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          checked: !state[action.id].checked,
        },
      };
    case types.DISABLE:
      backendToggle(state.slug, action.id, false);
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          enabled: false,
        },
      };
    case types.ENABLE:
      backendToggle(state.slug, action.id, true);
      return {
        ...state,
        [action.id]: {
          ...state[action.id],
          enabled: true,
        },
      };
  }
};
