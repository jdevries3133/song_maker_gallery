import React from "react";

import { useParams } from "react-router-dom";

import { GalleryConfig } from "./gallery_config";

export const GalleryConfigPage = () => {
  const { slug } = useParams();
  return <GalleryConfig slug={slug} />;
};
