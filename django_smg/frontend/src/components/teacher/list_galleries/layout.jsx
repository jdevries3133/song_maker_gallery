import React from "react";
import { Link } from "react-router-dom";

import styled, {
  Button as DefaultButton,
  H3,
  Grid as DefaultGrid,
  GridItem as Item,
} from "Styles";
import { windowLocation } from "../../../util/window";

/* Take away padding shrinkage media query */
const Button = styled(DefaultButton)`
  && {
    padding: 20px;
  }
`;

const Grid = styled(DefaultGrid)`
  margin: 1rem 0;

  @media (max-width: 600px) {
    margin: 3rem 0;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: repeat(1fr, 3);
  }
`;

/* Spans whole row on mobile */
const GalleryName = styled(Item)`
  @media (max-width: 600px) {
    font-size: 1.4rem;
    grid-column-start: 1;
    grid-column-end: 3;
  }
`;

/* This forms the table layout */
const GalleryRows = ({ galleries, requestDelete }) => (
  <div>
    {galleries.map((gallery, index) => {
      const galPath = `/gallery/${gallery["slug"]}/`;
      /* Inner default grid lays out buttons and titles */
      return (
        <Grid cols="3fr 2fr 2fr 2fr 2fr" key={index}>
          <GalleryName>
            <span>{gallery["title"].slice(0, 14)}</span>
            {gallery["title"].length < 14 ? null : <span>...</span>}
          </GalleryName>
          <Item>
            <Link data-testid="viewGalleryLink" to={galPath}>
              <Button data-testid="viewGalleryBtn" color="#00c4ff">
                View
              </Button>
            </Link>
          </Item>
          <Item>
            <Button color="lightgreen">Edit</Button>
          </Item>
          <Item>
            <Button color="pink">Settings</Button>
          </Item>
          <Item>
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
