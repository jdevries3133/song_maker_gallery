import React, { useState } from "react";
import styled, { P, H3, Blanket, Button } from "Styles";

const A = styled.a`
  font-weight: bold;
  text-decoration: underline;
  color: blue;
  display: block;
  margin: 20px auto;
`;

const TemplateHelpBlanket = (props) => (
  <Blanket>
    <H3>Template Help</H3>
    <a
      href="https://help.loyverse.com/help/how-open-csv-file-google-sheets"
      target="_blanket"
      rel="noopener noreferrer"
    >
      How to open a <code>.csv</code> file for free online with Google Sheets.
    </a>
    <P justify>
      When you click the orange button, your computer will download a{" "}
      <code>".csv"</code> file, which is a very simple format for storing
      tabular data, like a spreadsheet. <code>".csv" </code>
      files can therefore be opened by almost any spreadsheet program, including
      google sheets, which is available for free online.
    </P>
    <P justify>
      Once you are finished inputting your students' links, you will be ready to
      upload to this site and create a gallery for your students. At that time,
      you will need to export the spreadsheet from google sheets back into a csv
      file. The last step of that same guide above shows you how to do that too!
    </P>
    <Button color="salmon" onClick={props.onClose}>
      Close
    </Button>
  </Blanket>
);

/* Inline <a> element that opens a modal popup onClick */
// TODO: implement portal popup here to avoid invalid nesting
export const TemplateHelp = () => {
  const [blanket, setBlanket] = useState(null);
  return (
    <>
      {blanket}
      <A
        onClick={() =>
          setBlanket(<TemplateHelpBlanket onClose={() => setBlanket(null)} />)
        }
      >
        Template Help
      </A>
    </>
  );
};
