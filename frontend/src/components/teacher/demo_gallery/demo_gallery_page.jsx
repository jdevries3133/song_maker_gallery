import React from "react";

import Loading from "Common/loading";
import { usePublicGallery } from "Common/usePublicGallery";
import { useParams } from "react-router-dom";

import { DemoGallery } from "./demo_gallery";

export const DemoGalleryPage = () => {
  const { slug } = useParams();
  const { gallery, error } = usePublicGallery(slug);

  return gallery ? (
    error ? (
      error.status === 404 ? (
        <h1>Galery {slug} not found</h1>
      ) : (
        <h1>An error occured. Please try again.</h1>
      )
    ) : (
      <DemoGallery gallery={gallery} />
    )
  ) : (
    <Loading dark />
  );
};
