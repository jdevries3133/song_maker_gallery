import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { WelcomeText } from "./WelcomeText";
import styles from "../landing_page.module.css";

const desktop = () => {
  return (
    <Fragment>
      <h1 className={styles.h1}>Welcome to the Song Maker Gallery!</h1>
      <table className={styles.table}>
        <tbody>
          <tr>
            <td>
              <WelcomeText />
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
      <div className={styles.space} />
    </Fragment>
  );
};

export default desktop;
