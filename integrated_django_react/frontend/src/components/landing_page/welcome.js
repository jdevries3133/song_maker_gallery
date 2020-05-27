import React from "react";
import { Link } from "react-router-dom";

import styles from "./landing_page.module.css";

const welcome = (props) => {
  return (
    <div className={styles.div}>
      <h1 className={styles.head}>
        Welcome to the Music Lab Song Maker Gallery!
      </h1>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>
              <div className="description">
                <p>
                  This website was created by me, a music teacher, in response
                  to the simple need to find a way to feature our students' work
                  in light of the COVID-19 pandemic. Our students' concerts have
                  been cancelled, their rehearsals ceased, and their
                  opportunities to share music diminished to a whisper of what
                  they once were.
                </p>
                <p>
                  As a third, fourth, and fifth grade elementary general music
                  teacher, a big part of my COVID curriculum has been the{" "}
                  <a href="https://musiclab.chromeexperiments.com/">
                    Chrome Music Lab.
                  </a>{" "}
                  Students love making creations with it; it's fun and easy to
                  use, and it provides an amazing platform for us to discuss the
                  topics of the music curriculum. Without the ability to do so
                  many of our normal in-school activities, the music lab has
                  been indespensible.
                </p>
                <p>
                  <strong>This website</strong> is a simple way to share your
                  students' work with your whole community. I know that I have
                  been awestruck by the creativity of many of the music lab
                  compositions that my students have shared with me, and I am
                  sure that you feel the same.
                </p>
                <p>
                  <strong>
                    We need a beautiful, simple, and easy way to share these
                    compositions with as many people as possible!
                  </strong>
                </p>
                <h3>That is the purpose of this website.</h3>
              </div>
            </td>
            <td width="40" />
            <td>
              <h2>Below is a sample gallery.</h2>
              <br />
              <Link to="/signup">
                <button>
                  <span>Click here to make</span>
                  <br />
                  <span>your own free gallery.</span>
                </button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default welcome;
