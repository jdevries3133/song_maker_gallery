import React from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";

import styled, {Description as DefaultDescription, H2, P, Form} from "Styles";

import {ConfigItem} from "Common/config_item";

const Description = styled(DefaultDescription)`
  text-align: inherit;

  & p {
    max-width: 60ch;
  }
`;

export const GalleryConfigForm = ({
  state,
  onCheckedHandler,
  renderExtraForm,
  slug = null,
}) => (
  <Form onSubmit={(e) => e.preventDefault()}>
    <Description>
      <H2>Gallery Settings</H2>
      {state.allowStudentSubmissions.checked &&
        state.isGalleryPublished.checked && (
          <P warn justify>
            Warning! When galleries are editable and viewable, students can add
            songs which their peers can see right away!
          </P>
        )}
      <div>
        <ConfigItem
          id={state.allowStudentSubmissions.id}
          label="Allow Student Submissions"
          checked={state.allowStudentSubmissions.checked}
          onChange={() => onCheckedHandler(state.allowStudentSubmissions.id)}
            onCheckedHandler(state?.checkboxes.allowStudentSubmissions.id)
          }
        >
          Enable students to actively submit compositions{" "}
          {slug ? (
            <span>
              at <Link to={`/gallery/${slug}/submit-song/`}>this link.</Link>
            </span>
          ) : null}
        </ConfigItem>

        <ConfigItem
          id={state.isGalleryPublished.id}
          label="Gallery is Public"
          checked={state?.checkboxes.isGalleryPublished?.checked}
          onChange={() =>
            onCheckedHandler(state?.checkboxes.isGalleryPublished.id)
          }
        >
          When you switch this off, the gallery goes into private mode. This is
          helpful if you want to withhold the gallery leading up to a release,
          or want to keep it in private mode while student submissions are
          ongoing.{" "}
          <Link to={`/gallery/${slug}/`}>Click here to view this gallery.</Link>
        </ConfigItem>
      </div>
    </Description>
    {renderExtraForm}
  </Form>
);

GalleryConfigForm.propTypes = {
  onCheckedHandler: PropTypes.func.isRequired,
  state: PropTypes.shape({
    allowStudentSubmissions: PropTypes.shape({
      id: PropTypes.string,
      checked: PropTypes.bool,
    }),
    isGalleryPublished: PropTypes.shape({
      id: PropTypes.string,
      checked: PropTypes.bool,
    }),
  }),
};
