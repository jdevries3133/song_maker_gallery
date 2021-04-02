import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

import {
  postGallery,
  deleteGallery,
  acknowledgeDelete,
  getUserGalleries,
} from "Actions/user";
import ServerError from "Common/server_error";

import { ConfirmDelete } from "./confirm_delete";
import styled, { Description, Button, H3 } from "Styles";
import { Blanket } from "Common/blanket";

const StyledTable = styled.table`
  margin: auto;
  padding-bottom: 20px;
  border-spacing: 0px;
  width: 100%;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

const StyledTr = styled.tr`
  @media (max-width: 1170px) {
    &:nth-child(even) {
      background-color: rgb(238, 238, 238);
    }

    & > td {
      font-size: 14px;
    }
  }
`;

/**
 * This named export is only used for storybook. Usually, the redux-connected
 * default export is used.
 */
export const ListGalleries = (props) => {
  const [blanket, setBlanket] = useState(null);

  let user_gals;
  const onOk = () => {
    setBlanket(null);
    props.acknowledgeDelete();
  };

  useEffect(() => {
    if (props.deleteStatus) {
      if (props.deleteStatus === "deleted") {
        props.getUserGalleries(props.token);
        setBlanket(
          <Blanket>
            <h2>Success</h2>
            <p>Your gallery has been deleted.</p>
          </Blanket>
        );
      } else if (props.deleteStatus === "error") {
        setBlanket(<ServerError onOk={onOk} />);
      }
    }
  }, [props.deleteStatus]);

  const deleteConfirmed = (pk) => {
    props.deleteGallery(pk, props.token);
  };

  if (props.galleries) {
    user_gals = props.galleries.map((gallery, index) => {
      const url = `${window.location.href.slice(0, -7)}gallery/${
        gallery["slug"]
      }/`;
      return (
        <StyledTr key={index}>
          <td data-testid="galleryName" width="30%">
            {gallery["title"].slice(0, 14)}
            {gallery["title"].length < 14 ? null : <span>...</span>}
          </td>
          <td width="70%">
            <Link
              data-testid="viewGalleryLink"
              to={`/gallery/${gallery["slug"]}/`}
            >
              <Button data-testid="viewGalleryBtn" color="#00c4ff">
                View
              </Button>
            </Link>
            <Button
              data-testid="deleteGalleryBtn"
              color="#fa8071"
              onClick={() =>
                setBlanket(
                  <ConfirmDelete
                    url={url}
                    pk={gallery["pk"]}
                    confirmation={deleteConfirmed}
                  />
                )
              }
            >
              Delete
            </Button>
          </td>
        </StyledTr>
      );
    });
  }

  return (
    <Description>
      {blanket}
      <H3>Your Galleries</H3>
      <StyledTable>
        <tbody>
          {user_gals.length !== 0 ? (
            user_gals
          ) : (
            <tr>
              <td>
                <h3 style={{ fontWeight: 400 }}>
                  Your galleries will go here some day.
                </h3>
              </td>
            </tr>
          )}
        </tbody>
      </StyledTable>
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
