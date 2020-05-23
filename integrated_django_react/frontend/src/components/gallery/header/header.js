import React, { Fragment } from "react";

import FormattedDescription from "./formatted_description";

const header = (props) => {
  // CONDITIONALLY RENDER DEFAULT DESCRIPTION

  return (
    <Fragment>
      <div id="gallery_top">
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
    </Fragment>
  );
};

export default header;
