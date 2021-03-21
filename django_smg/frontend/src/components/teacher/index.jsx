import React, { useEffect } from "react";

import AddGallery from "./add_gallery";
import ListGalleries from "./list_galleries";

export const Teacher = ({ title }) => {
  useEffect(() => {
    document.title = title;
  }, []);
  return (
    <div>
      <AddGallery />
      <ListGalleries />
    </div>
  );
};
