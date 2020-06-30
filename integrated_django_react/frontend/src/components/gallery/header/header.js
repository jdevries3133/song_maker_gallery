import React from "react";
import styles from "./header.module.css";
import FormattedDescription from "./formatted_description";
import NavBar from "./navBar";
import useWidth from "../../generics/useWidth";

const header = (props) => {
  const { width } = useWidth();
  return (
    <div className={styles.gallery_top}>
      {width > 1000 ? <NavBar data={props.data} /> : null}
      <h1>{props.title}</h1>
      <div className="description">
        <FormattedDescription desc_str={props.description} />
        <p>
          <b>
            Hover over the picture of a students' work to see their name, and
            click to open their composition in a new tab
          </b>
        </p>
        <a href="#gallery">
          <button className={styles.call_to_action}>View Gallery</button>
        </a>
      </div>
      {width < 1000 ? <NavBar data={props.data} /> : null}
    </div>
  );
};

export default header;
