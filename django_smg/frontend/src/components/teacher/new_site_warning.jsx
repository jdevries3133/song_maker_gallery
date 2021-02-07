import React, { useState, Fragment } from "react";

import styled from "styled-components";

import styles from "./add_gallery/add_gallery.module.css";

const H1 = styled.h1`
  @media (max-width: 600px) {
    font-size: 30px;
  }
`;

const Msg = (props) => (
  <div className="description blanket">
    <H1>Bug/Site Status!</H1>
    <p className={styles.par_just}>
      As advertised, this is a brand new site, and bug reports are rolling in,
      which I'm trying to address. If you notice an issue, please submit an
      issue on{" "}
      <a
        target="_blanket"
        rel="noopener noreferrer"
        href="https://github.com/jdevries3133/song_maker_gallery/issues"
      >
        GitHub
      </a>
      . All the bugs or future improvements currently on my radar are already
      there.
    </p>
    <p style={{ textAlign: "left" }}>
      The following bugs have been patched since the site's launch. Most improve
      the way the site processes user-uploaded spreadsheets.
    </p>
    <ul
      className={styles.par_just}
      style={{ paddingLeft: "55px", paddingRight: "20px" }}
    >
      <li>
        Leading or trailing whitespace in spreadsheet no longer causes an error.
      </li>
      <li>Empty names in spreadsheet do not cause an error.</li>
      <li>
        Although Song Maker links were always validated to follow the
        appropriate pattern, the case of songs that follow the url pattern but
        nonetheless do not exist was not considered. Now, an "error tile" will
        appear in the gallery so that users can see not only that a link they
        uploaded was invalid; but also <i>which student's link</i>
        caused the issue.
      </li>
    </ul>

    <button onClick={() => props.close()} style={{ backgroundColor: "salmon" }}>
      Close
    </button>
  </div>
);

export const NewSiteWarn = () => {
  const [blanket, setBlanket] = useState(null);

  return (
    <Fragment>
      {blanket}
      <p>
        <a
          style={{ color: "red", backgroundColor: "white" }}
          onClick={() => setBlanket(<Msg close={() => setBlanket(null)} />)}
        >
          Bug Report! Bugs I've learned about, am fixing, and you should be
          aware of + how to contact me :)
        </a>
      </p>
    </Fragment>
  );
};
