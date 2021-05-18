import React, { useReducer, useState } from "react";

import styled, {
  Description as DefaultDescription,
  H2,
  P,
  Form,
  Input,
} from "Styles";

import {
  ConfigItem,
  ConfigItemSet,
  configItemReducer,
  types,
} from "Common/config_item";

const Emoji = styled.span`
  font-size: 2rem;
  margin 0 3vw;
`;

const InlineLabel = styled.label`
  margin-right: 20px;
`;

const Description = styled(DefaultDescription)`
  text-align: inherit;
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
export const GalleryConfig = ({ slug }) => {
  //TODO: the slug passed in should be the means by which we can interact
  //with the gallery
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
    socialGalPasscodeEnabled: {
      id: "socialGalPasscodeEnabled",
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
      checked: true,
    };
  });

  const [socialGalleryPasscode, setSocialGalleryPasscode] = useState("");
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
      <Description>
        <H2>Main Settings</H2>
        {state.allowStudentSubmissions.checked &&
          state.isGalleryPublished.checked && (
            <P warn justify>
              Warning! We do not advise making the gallery editable and viewable
              by students at the same time. Last thing you want is a student
              posting{" "}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://musiclab.chromeexperiments.com/Song-Maker/song/6209714916950016"
              >
                this!
              </a>
            </P>
          )}
        <div>
          <ConfigItem
            id={state.allowStudentSubmissions.id}
            label="Allow Student Submissions"
            checked={state.allowStudentSubmissions.checked}
            onChange={() => checkedHandler(state.allowStudentSubmissions.id)}
          >
            Enable students to actively submit compositions at{" "}
            <a href="#temp">this link.</a>
          </ConfigItem>

          <ConfigItem
            id={state.isGalleryPublished.id}
            label="Gallery is Public"
            checked={state.isGalleryPublished.checked}
            onChange={() => checkedHandler(state.isGalleryPublished.id)}
          >
            When you switch this off, the gallery goes into private mode. This
            is helpful if you want to withhold the gallery leading up to a
            release, or want to keep it in private mode while student
            submissions are ongoing.
          </ConfigItem>
        </div>
      </Description>

      <Description>
        <H2>Social Gallery Features</H2>

        <div>
          <ConfigItemSet>
            <ConfigItem
              id={state.enableSocialGal.id}
              label="Enable Social Gallery"
              checked={state.enableSocialGal.checked}
              onChange={() => checkedHandler(state.enableSocialGal.id)}
            >
              Flip this switch to turn this gallery into a social gallery, and
              to gain access to the finer grain settings below.
            </ConfigItem>

            <ConfigItem
              id={state.socialGalPasscodeEnabled.id}
              label="Social Gallery Passcode"
              checked={state.socialGalPasscodeEnabled.checked}
              onChange={() => checkedHandler(state.socialGalPasscodeEnabled.id)}
            >
              {state.socialGalPasscodeEnabled.checked ? (
                <>
                  <P left>
                    Students must enter this passcode to interact with the
                    social gallery
                  </P>
                  <InlineLabel htmlFor="socialGalleryPasscode">
                    Passcode
                  </InlineLabel>
                  <Input
                    id="socialGalleryPasscode"
                    type="text"
                    value={socialGalleryPasscode}
                    onChange={(e) => setSocialGalleryPasscode(e.target.value)}
                  />
                </>
              ) : null}
            </ConfigItem>

            <ConfigItem
              id={state.reactionsEnabled.id}
              label="Enable Reactions"
              checked={state.reactionsEnabled.checked}
              onChange={() => checkedHandler(state.reactionsEnabled.id)}
            >
              <Emoji>👍</Emoji>
              <Emoji>❤️</Emoji>
              <Emoji>⭐️</Emoji>
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
                No comments will be viewable until they are approved by you.
              </ConfigItem>
            </ConfigItemSet>
          </ConfigItemSet>
        </div>
      </Description>
    </Form>
  );
};
