import React from "react";

import styles from "../add_gallery.module.css";

/* This is just a blurb of jsx that can be inserted; no fancy modal */
export const InvalidFiletype = (props) => (
  <div>
    <p className={styles.warning}>
      You may only upload a csv file. At this time, we do not accept Excel
      files, or any other file format. Please click on "Template Help," above to
      learn more about downloading and working with our provided template.
    </p>
  </div>
);
