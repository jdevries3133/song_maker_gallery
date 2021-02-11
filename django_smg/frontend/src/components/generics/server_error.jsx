import React from "react";

import styled from "styled-components";

const P = styled.p`
  text-align: justify;
`;

const Ul = styled.ul`
  text-align: justify;
  margin-left: 40px;
`;

const server_error = (props) => {
  return (
    <div className="description blanket">
      <h2>Oops!</h2>
      <P>Our server must be in a bad mood today; please try again!</P>
      <P>
        <span style={{ color: "red" }}>Warning!: </span> Due to a{" "}
        <a href="https://github.com/jdevries3133/song_maker_gallery/issues/21">
          bug in the site,
        </a>{" "}
        you will see this screen if your spreadsheet contains invalid data. I am
        working on a fix for this but right now, but in the mean time, double
        check that none of your students sent you links that don't work or are
        incomplete. Remember, songmaker links should look like this:
      </P>
      <P>
        https://musiclab.chromeexperiments.com/Song-Maker/song/5163680023969792
      </P>
      <P>
        Critically, the number at the end should be sixteen digits long.
        Students often cut it short when they are copying and pasting. A single
        link where that has happened will cause this error to be raised.
      </P>
      <h3>Other causes for this error message include:</h3>
      <Ul>
        <li>Spreadsheets that do not follow the site's template</li>
        <li>Spreadsheets that do not have names or links in certain rows</li>
        <li>
          Submitting the gallery creation form with an empty title or
          description (which should be impossible at this point; but still)
        </li>
      </Ul>
      <P>
        If you are having trouble, I am more than happy to help you. Reach out
        to me directly at{" "}
        <a href="mailto:jackdevriesmusic@gmail.com">
          jackdevriesmusic@gmail.com
        </a>
      </P>
      <button onClick={() => props.onOk()}>Ok</button>
    </div>
  );
};
export default server_error;
