import React from "react";

import { P } from "Styles";

/* This is just a blurb of jsx that can be inserted; no fancy modal */
export const InvalidFiletype = () => (
  <>
    <P warn>
      You may only upload a csv file. At this time, we do not accept Excel
      files, or any other file format. Please click on "Template Help," above to
      learn more about downloading and working with our provided template.
    </P>
  </>
);
