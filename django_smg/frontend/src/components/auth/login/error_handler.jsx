import React, { useState } from "react";

import { ErrorArray } from "../../common/custom_error";

/**
 * Container to display server errors passed to <Login /> from redux.
 */
export const ErrorHandler = ({ err }) => {
  const [show, setShow] = useState(true);
  const toggle = () => setShow(!show);
  if (!err) {
    return null;
  }

  const errArray = Object.keys(err).map((k) => `${k}: ${err[k]}`);
  errArray.push(
    "Please check that you are using the correct username and password."
  );

  return show ? (
    <ErrorArray onOk={toggle} header="Error" message={errArray} />
  ) : null;
};
