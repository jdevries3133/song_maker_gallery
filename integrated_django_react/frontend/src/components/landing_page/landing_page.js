import React from "react";

import Gallery from "../gallery/gallery";
import * as sample from "./sample_gallery.json";

const landing_page = (props) => {
  return (
    <div>
      <Gallery
        title={sample.default.title}
        description={sample.default.description}
        data={sample.default.data}
      />
    </div>
  );
};

export default landing_page;
