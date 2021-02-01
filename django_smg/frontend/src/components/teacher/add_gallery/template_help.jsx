import React, { useState, Fragment } from "react";
import styles from "./add_gallery.module.css";

/* Inline <a> element that opens a modal popup onClick */
export const TemplateHelp = () => {
  const [blanket, setBlanket] = useState(null);
  return (
    <Fragment>
      {blanket}
      <a
        onClick={() =>
          setBlanket(
            <div className="description blanket">
              <h3>Template Help</h3>
              <p className={styles.par_just}>
                When you click the orange button, your computer will download a{" "}
                <code>".csv"</code> file, which is a very simple format for
                storing tabular data, like a spreadsheet. <code>".csv" </code>
                files can therefore be opened by almost any spreadsheet program,
                including google sheets, which is available for free online.
              </p>
              <p className={styles.par_just}>
                <a
                  href="https://help.loyverse.com/help/how-open-csv-file-google-sheets"
                  target="_blanket"
                  rel="noopener noreferrer"
                >
                  Click here for directions on how to open a <code>.csv</code>{" "}
                  file for free online with Google Sheets.
                </a>
              </p>
              <p className={styles.par_just}>
                Once you are finished inputting your students' links, you will
                be ready to upload to this site and create a gallery for your
                students. At that time, you will need to export the spreadsheet
                from google sheets back into a csv file. The last step of that
                same guide above shows you how to do that too!
              </p>
              <br />
              <h3>Seems a Bit Overwhelming?</h3>
              <p className={styles.par_just}>
                I agree! The next item on this project's roadmap is to create
                student submission links, which will allow students to do the
                link submitting themselves after you provide them with a simple
                link to do so. This feature will save teachers from having to
                corall many student links.
              </p>
              <p className={styles.par_just}>
                So, if this seems like too much, mark your calendars and check
                back soon!!
              </p>
              <br />
              <button
                style={{ backgroundColor: "salmon" }}
                onClick={() => setBlanket(null)}
              >
                Close
              </button>
            </div>
          )
        }
      >
        Template Help
      </a>
    </Fragment>
  );
};
