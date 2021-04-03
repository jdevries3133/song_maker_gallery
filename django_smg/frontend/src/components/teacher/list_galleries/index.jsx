import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import {
  postGallery,
  deleteGallery,
  acknowledgeDelete,
  getUserGalleries,
} from "Actions/user";

import { ConfirmDelete, ServerError, GalleryDeleted } from "./modals";
import { Description, H3 } from "Styles";
import { useModals, types } from "../../common/useModals";
import { UserGalleries } from "./user_galleries";

/**
 * This named export is only used for storybook. Usually, the redux-connected
 * default export is used.
 */
export const ListGalleries = (props) => {
  const [modals, dispatchModal] = useModals({
    props: props,
    modals: [
      {
        test: (props) => props.deleteStatus === "deleted",
        show: GalleryDeleted,
        onDismissed: props.acknowledgeDelete,
      },
      {
        test: (props) => props.deleteStatus === "error",
        show: ServerError,
        onDismissed: props.acknowledgeDelete,
      },
      {
        name: "ConfirmDelete",
        show: ConfirmDelete,
      },
    ],
  });

  const requestDelete = (ConfirmDeleteProps) => {
    dispatchModal("ConfirmDelete", {
      confirmation: deleteConfirmed,
      ...ConfirmDeleteProps,
    });
  };

  const deleteConfirmed = (pk) => {
    props.deleteGallery(pk, props.token);

    // dismount delete confirmation modal
    dispatchModal("ConfirmDelete", null, types.REMOVE);
  };

  return (
    <Description>
      {modals}
      <H3>Your Galleries</H3>
      <UserGalleries
        galleries={props.galleries}
        requestDelete={requestDelete}
      />
    </Description>
  );
};

ListGalleries.propTypes = {
  acknowledgeDelete: PropTypes.func,
  getUserGalleries: PropTypes.func,
  deleteStatus: PropTypes.string,
  deleteGallery: PropTypes.func,
  token: PropTypes.string,
  galleries: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      slug: PropTypes.string,
      pk: PropTypes.number,
    }).isRequired
  ),
};

/******************************************************************************
 * Redux connection
 */

const mapStateToProps = (state) => {
  return {
    galleries: state.user.galleries.map((gallery) => {
      return {
        title: gallery["title"],
        slug: gallery["slug"],
        pk: gallery["pk"],
      };
    }),
    token: state.auth.token,
    deleteStatus: state.user.deleteStatus,
  };
};

export default connect(mapStateToProps, {
  deleteGallery,
  getUserGalleries,
  postGallery,
  acknowledgeDelete,
})(ListGalleries);
