import React, { Fragment } from "react";
import styles from "./add_gallery.module.css";

import useWidth from "../../generics/useWidth";
import { Donate } from "../../gallery/donate/";

const Add = (props) => {
  const { width } = useWidth();

  return (
    <Fragment>
      <h3>Add a Gallery</h3>
      <h4 className={styles.par_just}>One Spreadsheet (.csv file) Per Group</h4>
      <p className={styles.par_just}>
        Galleries are separated into "groups." That may mean different things
        for different teachers. For me, I create one group per general music
        homeroom, then one gallery for each grade level I teach. You have the
        freedom to organize your gallery however you would like.
      </p>
      <p className={styles.par_just}>
        <b>The spreadsheet must be in the form of a .csv file</b>, which you can
        easily output from Excel or google sheets. To make sure your spreadsheet
        is formatted properly, use this template:
      </p>
      <a href="static/frontend/songmakergallery_upload_template.csv" download>
        <button className="button">Download Template</button>
      </a>
      <p className={styles.par_just}>
        You may make as many galleries as you would like, each containing as
        many groups as you would like, each containing as many students you
        would like.
      </p>
      <p className={styles.par_just}>
        Please do share this tool with your colleagues, and consider chipping in
        a few dollars to keep this site alive. We depend on your donations!
      </p>
      <Donate />
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
            files, or any other file format. Fear not, though! A CSV file can
            easily be exported from google sheets.
            <a
              href="https://www.solveyourtech.com/save-csv-google-sheets/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Here is an article showing you how.
            </a>
          </p>
        </Fragment>
      ) : null}
    </Fragment>
  );
};

export default Add;
