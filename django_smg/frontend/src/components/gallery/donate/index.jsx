import React, { useState } from "react";

import DonateButton from "./donate_button";
import Blanket from "./donate";

export const Donate = () => {
  const [blanket, setBlanket] = useState(null);

  return (
    <>
      {blanket}
      <DonateButton
        onClick={() => setBlanket(<Blanket onClose={() => setBlanket(null)} />)}
      >
        $
      </DonateButton>
    </>
  );
};
