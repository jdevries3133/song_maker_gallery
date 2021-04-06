import React from "react";
import { Link } from "react-router-dom";

import styled, {
  Button,
  H3,
  Grid as DefaultGrid,
  GridItem as Item,
} from "Styles";
import { windowLocation } from "../../../util/window";

const Grid = styled(DefaultGrid)`
  margin: 1rem 0;
`;

/* This forms the table layout */
const GalleryRows = ({ galleries, requestDelete }) => (
  <div>
    {galleries.map((gallery, index) => {
      const galPath = `/gallery/${gallery["slug"]}/`;
      /* Inner default grid lays out buttons and titles */
      return (
        <Grid cols="3fr 2fr 2fr 2fr 2fr" key={index}>
          <Item col="1">
            <span>{gallery["title"].slice(0, 14)}</span>
            {gallery["title"].length < 14 ? null : <span>...</span>}
          </Item>
          <Item col="2">
            <Button color="lightgreen">Edit</Button>
          </Item>
          <Item col="3">
            <Button color="pink">Settings</Button>
          </Item>
          <Item col="4">
            <Link data-testid="viewGalleryLink" to={galPath}>
              <Button data-testid="viewGalleryBtn" color="#00c4ff">
                View
              </Button>
            </Link>
          </Item>
          <Item col="5">
            <Button
              data-testid="deleteGalleryBtn"
              color="#fa8071"
              onClick={() =>
                requestDelete({
                  url: `${windowLocation("origin")}/${galPath}`,
                  pk: gallery["pk"],
                })
              }
            >
              Delete
            </Button>
          </Item>
        </Grid>
      );
    })}
  </div>
);

export const Layout = (props) => (
  <div>
    <H3>Your Galleries</H3>
    {props.galleries.length > 0 ? (
      <GalleryRows {...props} />
    ) : (
      <H3>Your galleries will go here some day.</H3>
    )}
  </div>
);
