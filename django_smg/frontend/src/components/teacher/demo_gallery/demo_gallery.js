import React from "react";
import styled, {
  Div,
  Button,
  Description,
  Grid,
  GridItem,
  P,
} from "Common/styles";
import GalleryBody from "./../../gallery/gal_body";

const ActionButton = styled(Button)`
  font-size: 1.3rem;
  padding: 25px;
  margin: 25px;
  @media (max-width: 600px) {
    padding: 18px;
    margin: 20px;
  }
`;
const DescriptionItem = styled(GridItem)`
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 1;
  grid-column-end: 2;
  @media (max-width: 600px) {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 2;
  }
`;
const ButtonItems = styled(GridItem)`
  grid-row-start: 1;
  grid-row-end: 3;
  grid-column-start: 2;
  grid-column-end: 3;
  @media (max-width: 600px) {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 2;
    grid-row-end: 3;
  }
`;

export const DemoGallery = ({ gallery }) => {
  return (
    <Div>
      <Grid cols="3fr 2fr" rows="1fr 1fr">
        <DescriptionItem>
          <Description>
            <P warn>
              Warning! This is a demo gallery that only you can view. To launch,
              click "Launch Gallery", or click "Go Back" to return to the form
              on the last page and make changes
            </P>
          </Description>
        </DescriptionItem>
        <ButtonItems>
          <ActionButton>Launch Gallery</ActionButton>
          <ActionButton> Go Back</ActionButton>
        </ButtonItems>
      </Grid>
      <GalleryBody
        title={gallery.title}
        description={gallery.description}
        data={gallery.songData}
      />
    </Div>
  );
};
