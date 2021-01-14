import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import styles from "./legal.module.css";

const PrivacyContent = (props) => (
  <Fragment>
    <h1 id="privacy-policy">Privacy Policy</h1>
    <p>
      This Agreement shall be governed by the laws of the State of New Jersey
    </p>
    <p>
      Also see our <Link to="/tos/">Terms of Service</Link>
    </p>
    {props.okButton ? props.okButton : null}
    <ol>
      <li>Do not use this website in the European Union.</li>
      <li>Do not use this website in the State of California.</li>
      <li>
        Please make a{" "}
        <a href="https://github.com/jdevries3133/song_maker_gallery">
          pull request
        </a>{" "}
        to help me handle cookies properly
      </li>
      <li>
        Do not upload any personallly identifying information (as defined in the
        Children's Online Privacy Protection Rule ("COPPA")) of any individual
        under thirteen years of age.
      </li>
      <li>
        Do not upload the personally identifying information of any individual
        under eighteen years of age without authorization to do so from that
        individual's parent or guardian.
      </li>
    </ol>
    {props.okButton ? props.okButton : null}
  </Fragment>
);

export const PrivacyPage = () => (
  <div className={`description ${styles.container}`} style={{ margin: "3%" }}>
    <PrivacyContent />
  </div>
);

export const PrivacyText = (props) => (
  <div className={`description blanket ${styles.container}`}>
    <PrivacyContent
      okButton={<button onClick={() => props.onOk()}>Close</button>}
    />
  </div>
);
