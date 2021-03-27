import React from "react";

import styled from "styled-components";

const P = styled.p`
  text-align: justify;
`;

const server_error = (props) => {
  return (
    <div className="description blanket">
      <h2>Oops!</h2>
      <P>Our server must be in a bad mood today; please try again!</P>
      <button onClick={() => props.onOk()}>Ok</button>
    </div>
  );
};
export default server_error;
