import React from "react";
import Add from "./add_gallery/add_gallery";
import YourGalleries from "./list_galleries";

/**
 * Formerly "<MobileOptimizedAdd />"
 */
export const TeacherLayout = ({ staged, ...rest }) => {
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
