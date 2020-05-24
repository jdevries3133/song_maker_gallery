import React from "react";
import styles from "./teacher.module.css";

const Verify = (props) => {
  return (
    <div className="blanket">
      <h2>Does this look good?</h2>
      <table>
        <tbody>
          {props.csv.map((content) => {
            <span>{content}</span>;
          })}
          ) }
        </tbody>
      </table>
    </div>
  );
};

export default Verify;
