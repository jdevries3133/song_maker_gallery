import React, { useState, useEffect } from "react";

import { ErrorArray } from "../../common/custom_error";

/**
 * Cleanup more common api message keys to make them more user friendly.
 */
const normalized = (msg) => {
  switch (msg) {
    case "non_field_errors":
      return "Error";
    default:
      return msg;
  }
};

/**
 * Container to display server errors passed to <Login /> from redux.
 */
export const ErrorHandler = ({ err }) => {
  const [modal, setModal] = useState(null);

  useEffect(() => {
    if (err) {
      const errArray = Object.keys(err).map(
        (k) => `${normalized(k)}: ${err[k]}`
      );
      errArray.push(
        "Please check that you are using the correct username and password."
      );
      setModal(
        <ErrorArray
          onOk={() => setModal(null)}
          header="Error"
          message={errArray}
        />
      );
    }
  }, [err]);

  if (!err) {
    return null;
  }
  return modal;
};
