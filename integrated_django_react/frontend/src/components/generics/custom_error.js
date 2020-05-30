import React from "react";

const custom_error = (props) => {
  return (
    <div className="description blanket">
      <h2>{props.header}</h2>
      {props.message.map((par) => (
        <p key={par}>{par}</p>
      ))}
      <button onClick={() => props.onOk()}>Ok</button>
    </div>
  );
};

export default custom_error;
