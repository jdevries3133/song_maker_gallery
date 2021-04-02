import React from "react";
import { Link } from "react-router-dom";

import styled, { Button, H3 } from "Styles";
import { windowLocation } from "../../../util/window";

const Placeholder = () => (
  <tr>
    <td>
      <H3>Your galleries will go here some day.</H3>
    </td>
  </tr>
);

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

const GalleryRows = ({ galleries, requestDelete }) =>
  galleries.map((gallery, index) => {
    const galPath = `/gallery/${gallery["slug"]}/`;
    return (
      <StyledTr key={index}>
        <td data-testid="galleryName" width="30%">
          {gallery["title"].slice(0, 14)}
          {gallery["title"].length < 14 ? null : <span>...</span>}
        </td>
        <td width="70%">
          <Link data-testid="viewGalleryLink" to={galPath}>
            <Button data-testid="viewGalleryBtn" color="#00c4ff">
              View
            </Button>
          </Link>
          <Button
            data-testid="deleteGalleryBtn"
            color="#fa8071"
            onClick={() =>
              requestDelete({
                url: `${windowLocation}galHref`,
                pk: gallery["pk"],
              })
            }
          >
            Delete
          </Button>
        </td>
      </StyledTr>
    );
  });

const StyledTable = styled.table`
  margin: auto;
  padding-bottom: 20px;
  border-spacing: 0px;
  width: 100%;
  @media (max-width: 500px) {
    width: 100%;
  }
`;

export const UserGalleries = (props) => (
  <StyledTable>
    <tbody>
      {props.galleries ? <GalleryRows {...props} /> : <Placeholder />}
    </tbody>
  </StyledTable>
);
