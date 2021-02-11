import React, { Fragment } from "react";
import styles from "./errors.module.css";

import { DownloadTemplate } from "../teacher/add_gallery/download_template";

export const CustomError = (props) => {
  return (
    <div className="description blanket">
      <div className={styles.container}>
        {props.children}
        <button onClick={() => props.onOk()}>Ok</button>
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
        {serverErrorMessage[k].map((i) => (
          <p>{i}</p>
        ))}
        {k === "songData" ? (
          <Fragment>
            <p>
              Make sure your spreadsheet follows our template! Also, make sure
              that your spreadsheet does not have any:
            </p>
            <ul>
              <li>Empty rows</li>
              <li>Missing names</li>
              <li>Invalid or dead Song Maker links</li>
            </ul>
            <DownloadTemplate />
          </Fragment>
        ) : null}
      </Fragment>
    ))}
  </CustomError>
);
