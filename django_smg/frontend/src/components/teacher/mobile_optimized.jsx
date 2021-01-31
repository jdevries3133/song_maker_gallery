import React from "react";
import Add from "./add_gallery/add_gallery";
import YourGalleries from "./your_galleries/your_galleries";

const mobile_optimized = ({ staged, ...rest }) => {
  return (
    <div>
      <div className="description">
        <Add {...rest} />
      </div>
      {staged ? <div className="description">{staged}</div> : null}
      <div className="description">
        <YourGalleries />
      </div>
    </div>
  );
};

export default mobile_optimized;
