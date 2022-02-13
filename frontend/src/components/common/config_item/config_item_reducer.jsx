import axios from "axios";
import store from "../../../store";

/* send new state to the backend via patch request */
const backendToggle = (slug, key, value) => {
  if (!slug || !key) return; // skip syncing with the backend; only update state
  /* convert frontend keys to backend keys */
  const keyNameMap = (key) => {
    const map = {
      allowStudentSubmissions: "is_editable",
      isGalleryPublished: "is_public",
    };
    return map[key];
  };
  const state = store.getState();
  // TODO: this API side-effect absolutely should not be buried in here,
  // because this is supposed to be a general purpose configuration component
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
 * If `checked` or `enabled` values are undefined for any of the keys in
 * `state`, we will make a request to the backend for the definitive resource,
 * and update state accordingly
 */
export const initState = async (state, token) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  const res = await axios.get(`/api/gallery/summary/${state.slug}/`, {
    headers: { Accept: "application/json", Authorization: `Token ${token}` },
  });
  // enable both, because the disabling feature isn't being used now
  state.checkboxes.allowStudentSubmissions.enabled = true;
  state.checkboxes.isGalleryPublished.enabled = true;
  try {
    state.checkboxes.allowStudentSubmissions.checked =
      res.data.is_editable || false;
    state.checkboxes.isGalleryPublished.checked = res.data.is_public || false;
  } catch (e) {
    // cannot read property blah of blah
  }
  return state;
};

/**
 * "checked" is the state of the checkbox
 * "enabled" indicates whether the config item appears to the user at all
 *
 * If enabled and checked are undefined, we will assume that we need to
 * initialize, and get the current state from the backend.
 */
export const types = {
  INIT: "INIT",
  TOGGLE: "TOGGLE",
  DISABLE: "DISABLE",
  ENABLE: "ENABLE",
};
export const configItemReducer = (state, action) => {
  switch (action.type) {
    case types.INIT:
      return { ...state, ...action.state };
    case types.TOGGLE:
      backendToggle(
        state.slug,
        action.id,
        !state.checkboxes[action.id].checked
      );
      return {
        ...state,
        checkboxes: {
          ...state.checkboxes,
          [action.id]: {
            ...state.checkboxes[action.id],
            checked: !state.checkboxes[action.id].checked,
          },
        },
      };
    case types.DISABLE:
      backendToggle(state.slug, action.id, false);
      return {
        ...state,
        checkboxes: {
          ...state.checkboxes,
          [action.id]: {
            ...state.checkboxes[action.id],
            enabled: false,
          },
        },
      };
    case types.ENABLE:
      backendToggle(state.slug, action.id, true);
      return {
        ...state,
        checkboxes: {
          ...state.checkboxes,
          [action.id]: {
            ...state.checkboxes[action.id],
            enabled: true,
          },
        },
      };
  }
};
