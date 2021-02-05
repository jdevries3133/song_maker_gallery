import React, { useState, Fragment } from "react";

import styles from "./add_gallery/add_gallery.module.css";

const Msg = (props) => (
  <div className="description blanket">
    <h1>Bug/Site Status!</h1>
    <p className={styles.par_just}>
      As advertised, this is a brand new site, and bug reports are rolling in,
      which I'm trying to address. The #1 absolute most important thing you
      should be aware of is that this site doesn't <i>really</i> vaidate the
      links you upload.
    </p>
    <p className={styles.par_just}>
      <span style={{ color: "red" }}>
        It is basically your responsibility to ensure that all the links you
        upload really exist.
      </span>{" "}
      I believe that the behavior of the backend is such that when it encounters
      a link that doesn't exist, it just drops that student from the gallery
      silently. However, I don't recall having thoroughly tested the site's
      behavior when it encounters invalid links, so it's possible that other
      weird things will happen.
    </p>
    <p className={styles.par_just}>
      In other news, there was a bug associated with whitespace (spaces or tabs)
      before or after student names or links in uploaded spreadsheets, but that
      has been fixed.
    </p>

    <p className={styles.par_just}>
      Thanks for your patience as I sort out this site's launch, and I hope you
      and your students are enjoying using it!
    </p>
    <p className={styles.par_just}>
      If you notice an issue, please submit an issue on{" "}
      <a
        target="_blanket"
        rel="noopener noreferrer"
        href="https://github.com/jdevries3133/song_maker_gallery/issues"
      >
        GitHub
      </a>
      . All the issues or future improvements currently on my radar are already
      there, so you can also see the status of development of the site for
      yourself.
    </p>

    <button onClick={() => props.close()} style={{ backgroundColor: "salmon" }}>
      Close
    </button>
  </div>
);

export const NewSiteWarn = (props) => {
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
