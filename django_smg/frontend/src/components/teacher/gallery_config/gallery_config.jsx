/**
 * note: social gallery elements are commented out. I don't think I'm going
 * to implement social galleries anytime soon.
 */
import React, {
  useReducer,
  // useState
} from "react";
import { connect } from "react-redux";

import {
  // ConfigItemSet,
  configItemReducer,
  types,
} from "Common/config_item";

import { GalleryConfigForm } from "./gallery_config_form";

// const Emoji = styled.span`
//   font-size: 2rem;
//   margin 0 3vw;
// `;

// const InlineLabel = styled.label`
//   margin-right: 20px;
// `;

/**
 * Allow the user to configure their galleries.
 *
 * - State
 *  - Allow student submissions (gallery is not public)
 *  - Publish gallery (student submissions will be blocked)
 *
 * - Social Gallery (on/off)
 *   - Reactions [like, heart, etc.] (on/off)
 *   - Comments (on/off to disable all)
 *      - Pre-Approve Comments? (on/off)
 */
export const _GalleryConfig = ({ slug, token }) => {
  const initialState = {
    slug,
    token,
    allowStudentSubmissions: {
      id: "allowStudentSubmissions",
    },
    isGalleryPublished: {
      id: "isGalleryPublished",
    },
    // enableSocialGal: {
    //   id: "enableSocialGal",
    // },
    // socialGalPasscodeEnabled: {
    //   id: "socialGalPasscodeEnabled",
    // },
    // reactionsEnabled: {
    //   id: "reactionsEnabled",
    // },
    // commentsEnabled: {
    //   id: "commentsEnabled",
    // },
    // moderateComments: {
    //   id: "moderateComments",
    // },
  };
  // TODO: initialState comes from API
  Object.keys(initialState).forEach((k) => {
    if (typeof k == "object") {
      initialState[k] = {
        ...initialState[k],
        enabled: true,
        checked: true,
      };
    }
  });

  // const [socialGalleryPasscode, setSocialGalleryPasscode] = useState("");
  const [state, dispatch] = useReducer(configItemReducer, initialState);

  const checkedHandler = (id) => {
    dispatch({
      id,
      type: types.TOGGLE,
    });
  };

  const submitHandler = (e) => e.preventDefault();

  return (
    <GalleryConfigForm
      state={state}
      onCheckedHandler={checkedHandler}
      onSubmitHandler={submitHandler}
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
