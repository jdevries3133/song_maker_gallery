import React, { useReducer, useEffect } from "react";
import { connect } from "react-redux";

import { initState, configItemReducer, types } from "Common/config_item";

import { GalleryConfigForm } from "./gallery_config_form";

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
