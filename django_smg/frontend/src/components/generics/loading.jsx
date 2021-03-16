import React from "react";
import styles from "./loading.module.css";

const loading = () => {
  return (
    <div className={styles.lds_ring} data-testid="loading spinner">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default loading;
