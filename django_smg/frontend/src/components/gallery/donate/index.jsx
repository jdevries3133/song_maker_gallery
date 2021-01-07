import React, { useState, Fragment } from "react";

import Button from "./donate_button";
import Blanket from "./donate";

export const Donate = (props) => {
  const [blanket, setBlanket] = useState(null);

  return (
    <Fragment>
      {blanket}
      <Button
        onClick={() => setBlanket(<Blanket onClose={() => setBlanket(null)} />)}
      >
        $
      </Button>
    </Fragment>
  );
};
