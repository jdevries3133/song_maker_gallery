import React from "react";
import { useParams } from "react-router-dom";

import Loading from "Common/loading";
import { usePublicGallery } from "Common/usePublicGallery";

import { GalleryForm } from "./gallery_form";

export const GalleryFormPage = () => {
  const { slug } = useParams();
  const { gallery, error } = usePublicGallery(slug);

  return error ? (
    error.status === 404 ? (
      <h1>Gallery {slug} was not found.</h1>
    ) : error.status === 500 ? (
      <h1>Server error. Please try again.</h1>
    ) : (
      <h1>Unknown error. Please try again.</h1>
    )
  ) : gallery ? (
    <GalleryForm gallery={gallery} />
  ) : (
    <Loading dark />
  );
};
