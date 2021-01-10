import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import { WelcomeText } from "./WelcomeText";
import styles from "../landing_page.module.css";

const mobile = () => {
  return (
    <Fragment>
      <h1 className={styles.h1}>Welcome to the Song Maker Gallery!</h1>
      <a href="#gallery_top">
        <button className={`button ${styles.welc_buttons}`}>
          View our sample gallery
        </button>
      </a>
      <br />
      <Link to="/signup">
        <button className={`button ${styles.welc_buttons} ${styles.green}`}>
          Make a custom gallery for free
        </button>
      </Link>
      <WelcomeText />
    </Fragment>
  );
};

export default mobile;
