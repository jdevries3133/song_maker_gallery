import React from "react";
import { Div, Button, Description, Grid, GridItem } from "Common/styles";
import GalleryBody from "./../../gallery/gal_body";

// const ActionButton = styled(Button)`
//   ${"" /* padding: 20px; */}
// `;
export const DemoGallery = ({ gallery }) => {
  return (
    <Div>
      <Description>
        Warning! This is a demo gallery that only you can view. To launch, click
        "Launch Gallery", or click "Go Back" to return to the form on the last
        page and make changes
      </Description>

      <Button block>Launch Gallery</Button>
      <Button block> Go Back</Button>

      <GalleryBody
        title={gallery.title}
        description={gallery.description}
        data={gallery.songData}
      />
    </Div>
  );
};
