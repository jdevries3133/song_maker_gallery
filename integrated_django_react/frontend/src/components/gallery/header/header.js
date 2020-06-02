import React from "react";
import styles from "./header.module.css";
import FormattedDescription from "./formatted_description";
import NavBar from "./navBar";

const header = (props) => {
  // CONDITIONALLY RENDER DEFAULT DESCRIPTION

  return (
    <div id="gallery_top">
      <NavBar data={props.data} />
      <h1>{props.title}</h1>
      <div className="description">
        <FormattedDescription desc_str={props.description} />
        <p>
          <b>
            Hover over the picture of a students' work to see their name, and
            click to open their composition in a new tab
          </b>
        </p>
      </div>
    </div>
  );
};

export default header;
