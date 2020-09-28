import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import styles from "../landing_page.module.css";

const desktop = () => {
  return (
    <Fragment>
      <h1 className={styles.head}>
        Welcome to the Music Lab Song Maker Gallery!
      </h1>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>
              <div className="description">
                <p style={{ textAlign: "justify" }}>
                  This website was created by me, a music teacher, in response
                  to the simple need to find a way to feature our students' work
                  in light of the COVID-19 pandemic. Our students' concerts have
                  been cancelled, their rehearsals ceased, and their
                  opportunities to share music diminished to a whisper of what
                  they once were.
                </p>
                <p style={{ textAlign: "justify" }}>
                  As a third, fourth, and fifth grade elementary general music
                  teacher, a big part of my COVID curriculum has been the{" "}
                  <a href="https://musiclab.chromeexperiments.com/">
                    Chrome Music Lab.
                  </a>{" "}
                  Students love making creations with it; it's fun and easy to
                  use, and it provides an amazing platform for us to discuss the
                  topics in our music curriculum. For me, the music lab has been
                  an indispensable tool for coping with our school closure.
                </p>
                <p style={{ textAlign: "justify" }}>
                  <strong>This website</strong> is a simple way to share your
                  students' work with your whole community. I know that I have
                  been awestruck by the creativity of many of the music lab
                  compositions that my students have shared with me, and I am
                  sure that you feel the same.
                </p>
                <p
                  style={{
                    fontWeight: "bold",
                    fontSize: "20px",
                    textAlign: "center",
                  }}
                >
                  We need a beautiful, simple, and easy way to share these
                  compositions with as many people as possible!
                </p>
              </div>
            </td>
            <td width="40" />
            <td>
              <a href="#gallery_top">
                <button className={`button ${styles.welc_buttons}`}>
                  View our sample gallery
                </button>
              </a>
              <br />
              <Link to="/signup">
                <button
                  className={`button ${styles.welc_buttons} ${styles.green}`}
                >
                  Make a custom gallery for free
                </button>
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </Fragment>
  );
};

export default desktop;
