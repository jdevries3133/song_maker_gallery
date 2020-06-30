import React from "react";
import styles from "./loading.module.css";

const loading = (props) => {
  return (
    <div className={styles.lds_ring}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default loading;
