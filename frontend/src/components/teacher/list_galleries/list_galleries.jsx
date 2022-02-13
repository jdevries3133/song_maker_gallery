import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { ConfirmDelete, ServerError, AcknowledgeDelete } from "./modals";
import { Description } from "Styles";
import { useModals, types } from "../../common/useModals";
import { Layout } from "./layout";

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
        show: AcknowledgeDelete,
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

  useEffect(() => {
    props.getUserGalleries(props.token);
  }, [props.deleteStatus]);

  const requestDelete = (ConfirmDeleteProps) => {
    dispatchModal("ConfirmDelete", {
      confirmation: deleteConfirmed,
      ...ConfirmDeleteProps,
    });
  };

  const deleteConfirmed = (pk) => {
    dispatchModal("ConfirmDelete", null, types.REMOVE);
    props.deleteGallery(pk, props.token);
  };

  return (
    <Description>
      {modals}
      <Layout galleries={props.galleries} requestDelete={requestDelete} />
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
