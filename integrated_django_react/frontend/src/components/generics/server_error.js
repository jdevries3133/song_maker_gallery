import React from "react";

const server_error = (props) => {
  return (
    <div className="description blanket">
      <h2>Oops!</h2>
      <p>Our server must be in a bad mood today; please try again!</p>
      <button onClick={() => props.onOk()}>Ok</button>
    </div>
  );
};
export default server_error;
