import React, { useState, Fragment } from "react";
import styled, { Blanket, Button } from "Styles";

const A = styled.a`
  text-decoration: underline;
  color: blue;
  fontweight: bold;
  display: block;
`;

const Container = styled(Blanket)`
  text-align: justify;
  font-size: 16px;

  & > ol > li {
    margin-bottom: 0.8rem;
  }

  & > ol > li > ul {
    margin-left: 10%;
    font-size: 12px;
  }
`;

const DirectionsBlanket = (props) => (
  <Container>
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
        appear in the gallery.
      </li>
      <li>
        In the staging area at the bottom of the page, add a title and edit the
        default description for your gallery.
      </li>
    </ol>
    <Button color="salmon" onClick={props.onClose}>
      Close
    </Button>
  </Container>
);

/* Inline <a> element that opens a modal popup onClick */
export const Directions = () => {
  const [blanket, setBlanket] = useState(null);
  return (
    <Fragment>
      {blanket}
      <A
        onClick={() =>
          setBlanket(<DirectionsBlanket onClose={() => setBlanket(null)} />)
        }
      >
        Directions: Quick Steps
      </A>
    </Fragment>
  );
};
