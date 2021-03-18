import React from "react";
import PropTypes from "prop-types";
import styles from "./errors.module.css";

const custom_error = (props) => {
  return (
    <div className="description blanket">
      <div className={styles.container}>
        <h2 data-testid="customError header">{props.header}</h2>
        {props.message.map((par, i) => (
          <p key={i}>{par}</p>
        ))}
        <button onClick={() => props.onOk()}>Ok</button>
      </div>
    </div>
  );
};

custom_error.propTypes = {
  header: PropTypes.string,
  message: PropTypes.array.isRequired,
  onOk: PropTypes.func.isRequired,
};

custom_error.defaultProps = {
  header: "Error",
};

export default custom_error;
