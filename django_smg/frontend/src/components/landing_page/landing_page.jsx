import React from "react";

import GalleryBody from "../gallery/gal_body";
import Welcome from "./welcome/welcome";
import styled, { Div as DefaultDiv } from "../common/styles";

import sampleGallery from "./sample-gallery.json";

const Div = styled(DefaultDiv)`
  margin-bottom: 11rem;
`;

const landing_page = () => {
  return (
    <Div>
      <Welcome />
      <GalleryBody
        title={sampleGallery.title}
        description={sampleGallery.description}
        data={sampleGallery.songData}
      />
    </Div>
  );
};

export default landing_page;
