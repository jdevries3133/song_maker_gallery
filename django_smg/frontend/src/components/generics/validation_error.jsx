import React, { Fragment } from "react";
import PropTypes from "prop-types";

import { DownloadTemplate } from "../teacher/add_gallery/snippets";
import { CustomError } from "./custom_error";

/**
 * ex. songData => "Spreadsheet Error"
 */
const backendMsgAdapter = (i) => {
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
          <h3 data-testid="errMsgTitle">{backendMsgAdapter(k)}</h3>
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
