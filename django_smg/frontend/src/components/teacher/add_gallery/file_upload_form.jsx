import React, { Fragment } from "react";
import styles from "./file_upload_form.module.css";

import { TemplateHelp } from "./snippets";
import { HowToVideo } from "./snippets";
import { Directions } from "./snippets";
import { DownloadTemplate } from "./snippets";
import { InvalidFiletype } from "./snippets";
import { Donate } from "../../gallery/donate/";

const FileUploadForm = (props) => {
  return (
    <div>
      <div>
        <h1 className={styles.h1}>Gallery Management Console</h1>
        <button
          className={styles.logout}
          onClick={() => {
            this.props.logout(this.props.token);
          }}
        >
          Log Out
        </button>
      </div>
      <h1 style={{ fontSize: "34px" }}>Add Gallery</h1>
      <DownloadTemplate />
      <TemplateHelp />
      <HowToVideo />
      <div className={styles.form_start}>
        <div>
          <h3>Add a Gallery</h3>
          <Directions />
          <h4>Upload One Spreadsheet (.csv file) Per Group</h4>
          {props.firstGroupUploaded ? (
            <Fragment>
              <h3 data-testid="firstFileUploadedMsg">🎉Nice!🎊</h3>
              <p>
                You uploaded your first spreadsheet! Scroll down to see our
                staging area, or upload another spreadsheet!
              </p>
            </Fragment>
          ) : null}
          <input
            data-testid="csvFileInput"
            className={styles.upload}
            type="file"
            ref={props.fileInputRef}
          />
        </div>
        <div>
          <button
            data-testid="addSpreadsheetButton"
            onClick={() => props.uploadRequest()}
            className={`button ${styles.add_ss}`}
          >
            Add Spreadsheet
          </button>
          <button
            data-testid="clearFileButton"
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            onClick={(e) => props.clearFileHandler(e)}
            className="button"
          >
            Clear File
          </button>
        </div>
        {props.warn ? <InvalidFiletype /> : null}
      </div>
      <div>
        <h3>Donate and Share!</h3>
        <p className={styles.par_just}>
          Please do share this tool with your colleagues, and consider chipping
          in a few dollars to keep this site alive. We depend on your donations!
        </p>
        <Donate />
      </div>
    </div>
  );
};

export default FileUploadForm;
