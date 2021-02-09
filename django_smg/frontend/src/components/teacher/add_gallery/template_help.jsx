import React, { useState, Fragment } from "react";
import styles from "./add_gallery.module.css";

const TemplateHelpBlanket = (props) => (
  <div className="description blanket">
    <h3>Template Help</h3>
    <a
      href="https://help.loyverse.com/help/how-open-csv-file-google-sheets"
      target="_blanket"
      rel="noopener noreferrer"
    >
      How to open a <code>.csv</code> file for free online with Google Sheets.
    </a>
    <p className={styles.par_just}>
      When you click the orange button, your computer will download a{" "}
      <code>".csv"</code> file, which is a very simple format for storing
      tabular data, like a spreadsheet. <code>".csv" </code>
      files can therefore be opened by almost any spreadsheet program, including
      google sheets, which is available for free online.
    </p>
    <p className={styles.par_just}>
      Once you are finished inputting your students' links, you will be ready to
      upload to this site and create a gallery for your students. At that time,
      you will need to export the spreadsheet from google sheets back into a csv
      file. The last step of that same guide above shows you how to do that too!
    </p>
    <button
      style={{ display: "block", margin: "auto", backgroundColor: "salmon" }}
      onClick={props.onClose}
    >
      Close
    </button>
  </div>
);

/* Inline <a> element that opens a modal popup onClick */
export const TemplateHelp = () => {
  const [blanket, setBlanket] = useState(null);
  return (
    <Fragment>
      {blanket}
      <a
        style={{ display: "block", margin: "20px auto" }}
        onClick={() =>
          setBlanket(<TemplateHelpBlanket onClose={() => setBlanket(null)} />)
        }
      >
        Template Help
      </a>
    </Fragment>
  );
};
