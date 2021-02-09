import React, { useState, Fragment } from "react";
import styles from "./add_gallery.module.css";

// TODO: factor directions into a separate modal window to declutter the main
// view.

const DirectionsBlanket = (props) => (
  <div className={`${styles.text_container} description blanket`}>
    <h3>Directions</h3>
    <ol>
      <li>
        Galleries are organized into groups. Consider what logical groups will
        be included in your gallery. Several groups will make for a nice
        browsing experience; for example, one for each homeroom in a grade
        level.
      </li>
      <li>
        Click the "Download Template" button once for each group you will make.
        A copy of the template will be downloaded each time.
      </li>
      <li>
        Rename the files you just downloaded to correspond with the groups you
        are going to create:
        <ul>
          <li>Third Grade General Music.csv</li>
          <li>Freshman Band.csv</li>
          <li>etc...</li>
        </ul>
      </li>
      <li>
        Replace the placeholder data in each template with your students' data.
        Click on, "template help," if you can't open or edit them template file
        on your computer.
      </li>
      <li>
        Upload group files one after another in the order you want them to
        appear in the order you want them to appear in the gallery.
      </li>
      <li>
        In the staging area at the bottom of the page, add a title and edit the
        default description for your gallery.
      </li>
    </ol>
    <button style={{ backgroundColor: "salmon" }} onClick={props.onClose}>
      Close
    </button>
  </div>
);

/* Inline <a> element that opens a modal popup onClick */
export const Directions = () => {
  const [blanket, setBlanket] = useState(null);
  return (
    <Fragment>
      {blanket}
      <a
        style={{ display: "block" }}
        onClick={() =>
          setBlanket(<DirectionsBlanket onClose={() => setBlanket(null)} />)
        }
      >
        Directions: Quick Steps
      </a>
    </Fragment>
  );
};
