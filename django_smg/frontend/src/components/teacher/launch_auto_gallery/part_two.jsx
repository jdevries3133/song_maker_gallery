import React, { useReducer } from "react";
import { GalleryConfigForm } from "../gallery_config";

import { configItemReducer, types } from "Common/config_item";
import { Button } from "Styles";

/**
 * Set is_editable and is_public settings
 */
export const BreadCrumbTwo = ({ onCrumbComplete }) => {
  const initialState = {
    checkboxes: {
      allowStudentSubmissions: {
        id: "allowStudentSubmissions",
        enabled: true,
        checked: true,
      },
      isGalleryPublished: {
        id: "isGalleryPublished",
        enabled: true,
        checked: false,
      },
    },
  };
  const [state, dispatch] = useReducer(configItemReducer, initialState);

  const checkedHandler = (id) => {
    dispatch({
      id,
      type: types.TOGGLE,
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    debugger;
    onCrumbComplete({
      is_public: state.checkboxes.isGalleryPublished.checked,
      is_editable: state.checkboxes.allowStudentSubmissions.checked,
    });
  };

  return (
    <GalleryConfigForm
      state={state}
      onCheckedHandler={checkedHandler}
      onSubmit={submitHandler}
      renderExtraForm={<Button>Submit</Button>}
    />
  );
};
