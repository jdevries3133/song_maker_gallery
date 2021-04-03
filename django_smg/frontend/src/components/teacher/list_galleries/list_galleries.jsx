import React from "react";
import PropTypes from "prop-types";

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

    //dismount delte confirmation modal
    dispatchModal("ConfirmDelete", {}, types.REMOVE);
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
