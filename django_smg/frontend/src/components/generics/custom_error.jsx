import React from "react";
import styles from "./errors.module.css";

const custom_error = (props) => {
  return (
    <div className="description blanket">
      <div className={styles.container}>
        <h2 data-testid="customError header">{props.header}</h2>
        {props.message.map((par, i) => (
          <p key={par}>{par}</p>
        ))}
        <button onClick={() => props.onOk()}>Ok</button>
      </div>
    </div>
  );
};

export default custom_error;
