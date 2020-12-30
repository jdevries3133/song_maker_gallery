import React from "react";
import styles from "./m.teacher.module.css";
import Add from "./add_gallery/add_gallery";
import YourGalleries from "./your_galleries/your_galleries";

const mobile_optimized = (props) => {
  return (
    <div>
      <div className="description">
        <Add
          file_selected={props.file_selected}
          file={props.file}
          clearFileHandler={props.clearFileHandler}
          groupname={props.groupname}
          groupNameChangeHandler={props.groupNameChangeHandler}
          uploadRequest={props.uploadRequest}
          warn={props.warn}
          verifyContent={props.verifyContent}
          uploadedContent={props.uploadedContent}
        />
      </div>
      {props.staged ? <div className="description">{props.staged}</div> : null}
      <div className="description">
        <YourGalleries />
      </div>
    </div>
  );
};

export default mobile_optimized;
