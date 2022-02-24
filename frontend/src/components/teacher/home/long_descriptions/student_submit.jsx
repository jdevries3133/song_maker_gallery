import React from "react";
import { P, Button } from "Styles";
import { LongDescriptionContainer } from "./commonStyles";

export const StudentSubmitDescription = ({ ctaHandler }) => (
  <LongDescriptionContainer>
    <P>
      <b>There is now an easier way! </b>With Student-Submit Galleries, we
      generate a link to a page where your students can submit their names and
      links to your gallery. Additionally, galleries can now be configured to
      allow students to attach a title and description to their creation in
      addition to their own name.
    </P>
    <P>
      This makes all kinds of new Song Maker lessons possible, so get creative!
    </P>
    <Button onClick={ctaHandler}>Start Yours Now</Button>
  </LongDescriptionContainer>
);
