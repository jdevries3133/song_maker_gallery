import React, { Fragment } from "react";
import PropTypes from "prop-types";
import styles from "./errors.module.css";

import { DownloadTemplate } from "../teacher/add_gallery/download_template";

export const CustomError = ({ children, onOk }) => {
  return (
    <div className="description blanket">
      <div className={styles.container}>
        {children}
        <button
          data-testid="onOkButton"
          style={{ backgroundColor: "#4caf50" }}
          onClick={onOk}
        >
          Ok
        </button>
      </div>
    </div>
  );
};

CustomError.propTypes = {
  children: PropTypes.node.isRequired,
  onOk: PropTypes.func.isRequired,
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
export const BadRequest = ({ serverErrorMessage, onOk }) => {
  return (
    <CustomError onOk={onOk}>
      {Object.keys(serverErrorMessage).map((k, i) => (
        <Fragment key={i}>
          <h3 data-testid="errMsgTitle">{technicalToEnglish(k)}</h3>
          <p style={{ fontWeight: "bold", textDecoration: "underline" }}>
            Errors:
          </p>
          <ul style={{ textAlign: "left" }}>
            {serverErrorMessage[k].map((msg, i) => (
              <li data-testid="errMsgItem" key={i}>
                {msg}
              </li>
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
};

BadRequest.propTypes = {
  serverErrorMessage: PropTypes.object.isRequired,
  onOk: PropTypes.func.isRequired,
};
