import React from "react";
import styles from "./your_galleries.module.css";

const confirm_delete = (props) => {
  return (
    <div className="description blanket">
      <h2>Are you Sure?</h2>

      <p>
        This gallery will be permanently deleted and no longer available at the
        url:
        <br />
        <a href={props.url}>{props.url}</a>
      </p>
      <button
        className={styles.delete_confirm}
        onClick={() => props.confirmation(props.extension)}
      >
        I am sure
      </button>
    </div>
  );
};
export default confirm_delete;
