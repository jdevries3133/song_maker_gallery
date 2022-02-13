import React, { useReducer, useEffect, useState } from "react";
import { connect } from "react-redux";
import axios from "axios";
import store from "../../../store";

import { initState, configItemReducer, types } from "Common/config_item";

import { GalleryConfigForm } from "./gallery_config_form";

/**
 * Inline hook to get the gallery name from the backend.
 */
const useGalleryName = (slug) => {
  const state = store.getState();
  const [name, setName] = useState("...");
  useEffect(() => {
    axios.defaults.xsrfCookieName = "csrftoken";
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
    axios
      .get(`/api/gallery/summary/${slug}/`, {
        headers: { Authorization: `Token ${state.auth.token}` },
      })
      .then((res) => setName(`"${res.data.title}"`));
  });
  return name;
};

/**
 * Allow the user to configure their galleries.
 *
 * - State
 *  - Allow student submissions (gallery is not public)
 *  - Publish gallery (student submissions will be blocked)
 *
 */
const _GalleryConfig = ({ slug, token }) => {
  const initialState = {
    slug,
    checkboxes: {
      allowStudentSubmissions: {
        id: "allowStudentSubmissions",
      },
      isGalleryPublished: {
        id: "isGalleryPublished",
      },
    },
  };

  const [state, dispatch] = useReducer(configItemReducer, initialState);
  const galleryName = useGalleryName(slug);

  useEffect(() => {
    if (token) {
      initState(state, token)
        .then((firstState) => {
          dispatch({
            state: firstState,
            type: types.INIT,
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [token]);

  const checkedHandler = (id) => {
    dispatch({
      id,
      type: types.TOGGLE,
    });
  };

  return (
    <GalleryConfigForm
      galleryName={galleryName}
      state={state}
      onCheckedHandler={checkedHandler}
      slug={slug}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    token: state.auth.token,
  };
};

export const GalleryConfig = connect(mapStateToProps)(_GalleryConfig);
