import React, { Fragment } from "react";
import styles from "./add_gallery.module.css";

import useWidth from "../../generics/useWidth";

const Add = (props) => {
  const { width } = useWidth();

  return (
    <Fragment>
      <h3>Add a Gallery</h3>
      <p className={styles.par_just}>
        To add a group to your gallery, upload a spreadsheet of students' names,
        and their music lab links. You may use students' first names only, or
        first name and last initial. If you do upload a student's full name,
        only their first name and last initial will be publically displayed; and
        only their first name and last initial will be stored in our database
        for COPPA compliance.
      </p>
      <p className={styles.par_just}>
        The spreadsheet must be in the form of a .csv file, which you can easily
        output from Excel or google sheets. As long as there is a column labeled
        "names," and "links," in the spreadsheet, we will pick up on the rest.
      </p>
      <p className={styles.par_just}>
        A gallery can have up to five groups in it, and you can make as many
        galleries as you would like. Limiting it to five groups per gallery
        ensures a consistent design, and prevents viewers being presented with a
        monolith page to scroll through. Add groups by uploading CSV files of
        names and links one at a time!
      </p>
      <br />
      <p className={styles.par_just}>Upload one spreadsheet per group.</p>
      <br />
      <input className={styles.upload} type="file" ref={props.fileInputRef} />
      <br />
      <button
        onClick={() => props.uploadRequest()}
        className={`button ${styles.up_btn}`}
      >
        Next
      </button>
      <button
        onClick={(e) => props.clearFileHandler(e)}
        className={`button ${styles.restart_btn}`}
      >
        Clear File
      </button>
      {props.warn ? (
        <Fragment>
          <br />
          <p className={styles.warning}>
            You may only upload a csv file. At this time, we do not accept Excel
            files, or any other file format. I have some videos below that might
            help you if you are using Excel or google sheets, though!
          </p>
          {width < 1046 ? (
            // Mobile sized embedded video
            <iframe
              width="300"
              height="415"
              src="https://www.youtube.com/embed/ScMzIvxBSi4"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            // Regular sized embedded video
            <iframe
              width="560"
              height="315"
              src="https://www.youtube.com/embed/ScMzIvxBSi4"
              frameBorder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default Add;
