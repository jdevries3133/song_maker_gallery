import React, { Fragment } from "react";

/**
 * TODO: remove this, it is a duplicated generic component
 */
export const BackendRegistrationError = ({ errors, onClose }) => {
  return (
    <div className="description blanket">
      <h1>Error</h1>
      {Object.keys(errors).map((k) => (
        <Fragment key={k + Math.random().toString()}>
          <h3 style={{ display: "inline" }}>{k}: </h3>
          {errors[k].map((v) => (
            <p key={v + Math.random().toString()} style={{ display: "inline" }}>
              {v}
            </p>
          ))}
          <br />
        </Fragment>
      ))}
      <button onClick={() => onClose()}>Ok</button>
    </div>
  );
};
