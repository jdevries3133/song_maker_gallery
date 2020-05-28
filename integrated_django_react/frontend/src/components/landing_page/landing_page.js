import React from "react";

import GalleryBody from "../gallery/gal_body";
import Welcome from "./welcome";
import { connect } from "react-redux";
import { getGallery } from "../../actions/gallery";
import styles from "./landing_page.module.css";

const landing_page = (props) => {
  props.getGallery("sample-gallery"); // warning: make sure you take sample-gallery with you into new databases
  if (props.status == undefined) {
    return (
      <div>
        <Welcome />
        <div className={styles.space} />
        <h1>Loading</h1>
      </div>
    );
  } else {
    if (props.status != 200) {
      props.getGallery("sample-gallery");
      return (
        <div>
          <h1>Internal Server Error</h1>
        </div>
      );
    } else {
      return (
        <div>
          <Welcome />
          <div className={styles.space} />
          <GalleryBody
            title={props.gallery.title}
            description={props.gallery.description}
            data={props.gallery.api_obj}
          />
        </div>
      );
    }
  }
};

const mapStateToProps = (state) => {
  return { gallery: state.gallery.gallery, status: state.gallery.status };
};

export default connect(mapStateToProps, { getGallery })(landing_page);
