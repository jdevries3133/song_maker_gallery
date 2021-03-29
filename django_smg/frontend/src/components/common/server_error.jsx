import React from "react";

import { P, Button, Blanket } from "./styles";

const server_error = (props) => {
  return (
    <Blanket>
      <h2>Oops!</h2>
      <P justify>Our server must be in a bad mood today; please try again!</P>
      <Button onClick={() => props.onOk()}>Ok</Button>
    </Blanket>
  );
};
export default server_error;
