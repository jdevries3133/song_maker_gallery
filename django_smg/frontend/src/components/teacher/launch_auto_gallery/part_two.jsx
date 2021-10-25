import React, { useReducer } from "react";
import { GalleryConfigForm } from "../gallery_config";

import { configItemReducer, types } from "Common/config_item";
import { Button } from "Styles";

/**
 * Set is_editable and is_public settings
 */
export const BreadCrumbTwo = ({ onCrumbComplete }) => {
  const initialState = {
    allowStudentSubmissions: {
      id: "allowStudentSubmissions",
      checked: false,
    },
    isGalleryPublished: {
      id: "isGalleryPublished",
      checked: false,
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
    onCrumbComplete({
      is_public: state.isGalleryPublished.checked,
      is_editable: state.allowStudentSubmissions.checked,
    });
  };

  return (
    <GalleryConfigForm
      state={state}
      onCheckedHandler={checkedHandler}
      onSubmitHandler={submitHandler}
      renderExtraForm={<Button>Submit</Button>}
    />
  );
};
