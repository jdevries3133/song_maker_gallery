import React from "react";

import DefaultDescription from "./defaultDescription";

const header = (props) => {
  // CONDITIONALLY RENDER DEFAULT DESCRIPTION

  return (
    (<div name="gallery_top" />),
    (
      <div>
        <h1>{props.title}</h1>
        <div className="description">
          <DefaultDescription />
          <p>
            <b>
              Hover over the picture of a students' work to see their name, and
              click to open their composition in a new tab
            </b>
          </p>
        </div>
      </div>
    )
  );
};

export default header;
