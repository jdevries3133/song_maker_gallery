import React from "react";

import GalleryBody from "../gallery/gal_body";
import Welcome from "./welcome";
import { connect } from "react-redux";
import { getGallery } from "../../actions/galleries";
import styles from "./landing_page.module.css";
import * as sample from "./sample_gallery.json";

const landing_page = (props) => {
  props.getGallery("sample-gallery"); // warning: make sure you take sample-gallery with you into new databases
  if (props.gallery == undefined) {
    return <div></div>;
  } else {
    return (
      <div>
        <Welcome />
        <div className={styles.space} />
        <GalleryBody
          title={sample.default.title}
          description={sample.default.description}
          data={sample.default.data}
        />
      </div>
    );
  }
};

const mapStateToProps = (state) => {
  return { gallery: state.galleries.galleries[0] };
};

export default connect(mapStateToProps, { getGallery })(landing_page);
