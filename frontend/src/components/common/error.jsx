import React from "react";

import { H2 } from "Styles";
import { windowLocation } from "../../util/window";

export const NotFound = () => {
  return (
    <H2 center>
      <code>"{windowLocation("pathname")}"</code> does not exist!
    </H2>
  );
};
