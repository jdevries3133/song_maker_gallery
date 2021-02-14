import React, { Fragment } from "react";
import styles from "./errors.module.css";

import { DownloadTemplate } from "../teacher/add_gallery/download_template";

export const CustomError = (props) => {
  return (
    <div className="description blanket">
      <div className={styles.container}>
        {props.children}
        <button
          style={{ backgroundColor: "#4caf50" }}
          onClick={() => props.onOk()}
        >
          Ok
        </button>
      </div>
    </div>
  );
};

// ex. songData => "Spreadsheet Error"
const technicalToEnglish = (i) => {
  switch (i) {
    case "songData":
      return "Spreadsheet Not Valid";
    default:
      return i.slice(0, 1).toUpperCase() + i.slice(1, i.length);
  }
};

/* For when a 400 code comes back */
export const BadRequest = ({ serverErrorMessage, onOk }) => (
  <CustomError onOk={onOk}>
    {Object.keys(serverErrorMessage).map((k) => (
      <Fragment>
        <h3>{technicalToEnglish(k)}</h3>
        <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
          Errors:
        </p>
        <ul style={{ textAlign: "left" }}>
          {serverErrorMessage[k].map((i) => (
            <li>{i}</li>
          ))}
        </ul>
        {k === "songData" ? (
          <Fragment>
            <h3>Quick Tips</h3>
            <p>
              Make sure your spreadsheet follows our template. Download it and
              take a look!
            </p>
            <DownloadTemplate />
          </Fragment>
        ) : null}
      </Fragment>
    ))}
  </CustomError>
);
