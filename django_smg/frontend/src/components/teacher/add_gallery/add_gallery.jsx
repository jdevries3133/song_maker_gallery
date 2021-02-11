import React, { Fragment } from "react";
import styles from "./add_gallery.module.css";

import { TemplateHelp } from "./template_help";
import { HowToVideo } from "./howto_video";
import { Directions } from "./directions";
import { DownloadTemplate } from "./download_template";
import { InvalidFiletype } from "./invalid_filetype";
import { Donate } from "../../gallery/donate/";

const Add = (props) => {
  return (
    <Fragment>
      <h1 style={{ fontSize: "34px" }}>Add Gallery</h1>
      <DownloadTemplate />
      <TemplateHelp />
      <HowToVideo />
      <div className={styles.form_start}>
        <h3>Add a Gallery</h3>
        <Directions />
        <h4>Upload One Spreadsheet (.csv file) Per Group</h4>
        {props.firstGroupUploaded ? (
          <Fragment>
            <h3>🎉Nice!🎊</h3>
            <p>
              You uploaded your first spreadsheet! Scroll down to see our
              staging area, or upload another spreadsheet!
            </p>
          </Fragment>
        ) : null}
        <input className={styles.upload} type="file" ref={props.fileInputRef} />
        <div>
          <button
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onClick={() => props.uploadRequest()}
            className={`button ${styles.up_btn}`}
          >
            Add Spreadsheet
          </button>
          <button
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onClick={(e) => props.clearFileHandler(e)}
            className={`button ${styles.restart_btn}`}
          >
            Clear File
          </button>
        </div>
        {props.warn ? <InvalidFiletype /> : null}
      </div>
      <h3>Donate and Share!</h3>
      <p className={styles.par_just}>
        Please do share this tool with your colleagues, and consider chipping in
        a few dollars to keep this site alive. We depend on your donations!
      </p>
      <Donate />
    </Fragment>
  );
};

export default Add;
