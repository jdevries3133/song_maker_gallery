import React from "react";
import { P, Button } from "Styles";
import { LongDescriptionContainer } from "./commonStyles";

export const ManualDescription = ({ ctaHandler }) => (
  <LongDescriptionContainer>
    <P>
      If you have used the Song Maker Gallery before, this is the, "old
      fashioned," way of making galleries. We have a spreadsheet template that
      you can download, you will then gather the links to all your students'
      compositions from the{" "}
      <a
        href="https://musiclab.chromeexperiments.com/Song-Maker/"
        target="_blanket"
        rel="noopener noreferrer"
      >
        Chrome Music Lab Song Maker,{" "}
      </a>
      and you will later upload several spreadsheets to make your gallery.
    </P>
    <P>
      <b>Use this method</b> if you have existing spreadsheets to upload, or you
      have already collected students links.
    </P>
    <P>
      <b>Do not use this method in most cases! </b>Use the automatic gallery
      instead.
    </P>
    <Button onClick={ctaHandler}>Learn More</Button>
  </LongDescriptionContainer>
);
