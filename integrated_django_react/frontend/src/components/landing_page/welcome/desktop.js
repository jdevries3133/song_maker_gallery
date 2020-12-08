import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import styles from "../landing_page.module.css";

import { TextCommon } from './text_common'

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
              <TextCommon />
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
