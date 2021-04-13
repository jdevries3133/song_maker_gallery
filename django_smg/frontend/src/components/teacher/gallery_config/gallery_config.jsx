import React, { useReducer } from "react";

import styled, { H2, P, Form, Button } from "Styles";

import {
  ConfigItem,
  ConfigItemSet,
  configItemReducer,
  types,
} from "Common/config_item";

/* emphasize */
const E = styled.span`
  font-weight: bold;
  font-style: italic;
`;

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
export const GalleryConfig = () => {
  // TODO: HOC should pass this state down after a data request and show
  // a loading icon until then
  const initialState = {
    allowStudentSubmissions: {
      id: "allowStudentSubmissions",
    },
    isGalleryPublished: {
      id: "isGalleryPublished",
    },
    enableSocialGal: {
      id: "enableSocialGal",
    },
    reactionsEnabled: {
      id: "reactionsEnabled",
    },
    commentsEnabled: {
      id: "commentsEnabled",
    },
    moderateComments: {
      id: "moderateComments",
    },
  };
  Object.keys(initialState).forEach((k) => {
    initialState[k] = {
      ...initialState[k],
      enabled: true,
      checked: false,
    };
  });

  const [state, dispatch] = useReducer(configItemReducer, initialState);

  const checkedHandler = (id) => {
    dispatch({
      id,
      type: types.TOGGLE,
    });
  };

  const submitHandler = (e) => e.preventDefault();

  return (
    <Form onSubmit={submitHandler}>
      <div>
        <H2>Gallery State</H2>
        <P warn>
          By making the gallery simultaneously public and editable by students
          through submission, an opportunity for students to take advantage is
          created. Unless you have a unique lesson plan that uses the ability to
          do these two things at once, I recommend you keep your gallery either
          open for submissions <E>OR</E> public; not both.
        </P>

        <ConfigItem
          id={state.allowStudentSubmissions.id}
          label="Allow Student Submissions"
          checked={state.allowStudentSubmissions.checked}
          onChange={() => checkedHandler(state.allowStudentSubmissions.id)}
        >
          <P>
            Enable students to actively submit compositions at{" "}
            <a href="#temp">this link</a>
          </P>
        </ConfigItem>

        <ConfigItem
          id={state.isGalleryPublished.id}
          label="Gallery is Private"
          checked={state.isGalleryPublished.checked}
          onChange={() => checkedHandler(state.isGalleryPublished.id)}
        >
          <P>
            If on, only you can see the gallery. If off, anyone can see the
            gallery at the link. This is helpful if you want to withhold the
            gallery leading up to a release, or want to keep it in private mode
            while student submissions are ongoing
          </P>
        </ConfigItem>
      </div>
      <div>
        <H2>Social Gallery Features</H2>

        <ConfigItemSet>
          <ConfigItem
            id={state.enableSocialGal.id}
            label="Enable Social Gallery"
            checked={state.enableSocialGal.checked}
            onChange={() => checkedHandler(state.enableSocialGal.id)}
          >
            <P>
              Flip this switch to turn this gallery into a social gallery, and
              to gain access to the finer grain settings below
            </P>
          </ConfigItem>

          <ConfigItem
            id={state.reactionsEnabled.id}
            label="Enable Reactions"
            checked={state.reactionsEnabled.checked}
            onChange={() => checkedHandler(state.reactionsEnabled.id)}
          >
            <P>Like, Thumb's Up, Star, etc.</P>
          </ConfigItem>

          <ConfigItemSet>
            <ConfigItem
              id={state.commentsEnabled.id}
              label="Enable Comments"
              checked={state.commentsEnabled.checked}
              onChange={() => checkedHandler(state.commentsEnabled.id)}
            />
            <ConfigItem
              id={state.moderateComments.id}
              label="Pre-Approve All Comments"
            >
              <P>No comments will be viewable until they are approved by you</P>
            </ConfigItem>
          </ConfigItemSet>
        </ConfigItemSet>
      </div>
    </Form>
  );
};
