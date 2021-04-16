import React from "react";

import { P } from "./styles";
import { Blanket } from "./blanket";

export const ServerError = ({ onOk }) => {
  return (
    <Blanket onDismissed={onOk}>
      <h2>Oops!</h2>
      <P justify>Our server must be in a bad mood today; please try again!</P>
    </Blanket>
  );
};
