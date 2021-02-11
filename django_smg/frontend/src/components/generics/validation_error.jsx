import React from "react";
import styles from "./errors.module.css";

export const ValidationError = (props) => {
  return (
    <div className="description blanket">
      <div className={styles.container}>
        {props.children}
        <button onClick={() => props.onOk()}>Ok</button>
      </div>
    </div>
  );
};
