import React from "react";

import GalleryBody from "../gallery/gal_body";
import { LandingPageHeader } from "./header";
import styled, { Div as DefaultDiv } from "Styles";

import sampleGallery from "./sample_gallery.json";

const Div = styled(DefaultDiv)`
  margin-bottom: 11rem;
`;

export const LandingPage = () => {
  return (
    <Div>
      <LandingPageHeader />
      <GalleryBody
        title={sampleGallery.title}
        description={sampleGallery.description}
        data={sampleGallery}
      />
    </Div>
  );
};
