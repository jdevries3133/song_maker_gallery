import React, { Fragment } from "react";
import styles from "./teacher.module.css";

const Verify = (props) => {
  var nameIndex;
  var linkIndex;
  var filtered;
  for (let i = 0; i < props.csv.data[0].length; i++) {
    if (
      props.csv.data[0][i].toLowerCase() === "name" ||
      props.csv.data[0][i].toLowerCase() === "names"
    ) {
      var nameIndex = i;
    } else if (
      props.csv.data[0][i].toLowerCase() === "links" ||
      props.csv.data[0][i].toLowerCase() === "link"
    ) {
      var linkIndex = i;
    }
  }
  if (typeof nameIndex === "number" && typeof linkIndex === "number") {
    filtered = props.csv.data.filter((row) => [row[nameIndex], row[linkIndex]]);
  } else if (typeof nameIndex === "number" || typeof linkIndex === "number") {
    if (nameIndex == undefined) {
      return (
        <div className={`description blanket ${styles.scroll_blanket}`}>
          <h2>Whoops!</h2>
          <p>
            It looks like your spreadsheet didn't have a header of "name," can
            you select the column that contains <b>names?</b>
          </p>
          {props.csv.data[0].map((row, index) => {
            <button
              onClick={() => {
                nameIndex = index;
              }}
            >
              {row}
            </button>;
            <button
              onClick={(e) => props.restart(e)}
              className={`button ${styles.restart_btn}`}
            >
              Restart
            </button>;
          })}
        </div>
      );
    } else if (linkIndex == undefined) {
      return (
        <div className={`description blanket ${styles.scroll_blanket}`}>
          <h2>Whoops!</h2>
          <p>
            It looks like your spreadsheet didn't have a header of "link," can
            you select the column that contains <b>links?</b>
          </p>
          {props.csv.data[0].map((row, index) => {
            <button onClick={() => (linkIndex = index)}>{row}</button>;
          })}
          <button
            onClick={(e) => props.restart(e)}
            className={`button ${styles.restart_btn}`}
          >
            Restart
          </button>
        </div>
      );
    }
  } else if (nameIndex === undefined && linkIndex === undefined) {
    return (
      <div className={`description blanket ${styles.scroll_blanket}`}>
        <h2>Whoops!</h2>
        <p>
          Make sure your spreadsheet has header rows of "name," and "link," like
          the example below!
        </p>
        <button
          onClick={(e) => props.restart(e)}
          className={`button ${styles.restart_btn}`}
        >
          Restart
        </button>
      </div>
    );
  }
  if (typeof filtered == undefined) {
    filtered = props.csv.data.filter((row) => {
      return [row[nameIndex], row[linkIndex]];
    });
  }
  if (
    typeof filtered == undefined &&
    typeof nameIndex == undefined &&
    typeof linkIndex == undefined
  ) {
    throw new Error(
      "verify.js name and link index should be definied at this time, but they are not"
    );
  }
  if (typeof filtered != undefined) {
    return (
      <div className={`description blanket ${styles.scroll_blanket}`}>
        <h2>Does this look good?</h2>
        <h3>Group Name to Display:</h3>
        <input
          className={`${styles.input} ${styles.wide_input}`}
          value={props.groupname}
          onChange={(e) => props.groupNameChange(e)}
        />
        <br />
        <table className={styles.blanket_table}>
          <thead>
            <tr>
              <td>Name</td>
              <td>Link</td>
            </tr>
          </thead>
          <tbody>
            {
              // mmmmm spaghetti
              filtered.slice(1).map((row, index) => {
                var name_arr = row[nameIndex].split(" ");

                // try for last initial
                if (name_arr.length > 1) {
                  const last_initial = name_arr[name_arr.length - 1][0];
                  // uh oh didn't think of trailing whitespace
                  if (
                    last_initial != undefined ||
                    last_initial === "" ||
                    last_initial === " "
                  ) {
                    var display = name_arr[0] + " " + last_initial + ".";
                  } else {
                    var display = name_arr[0];
                  }
                } else {
                  var display = name_arr[0];
                }
                return (
                  <tr key={index}>
                    <td align="left">{display}</td>
                    <td align="left">{row[linkIndex].slice(0, 30)}...</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
        <button
          onClick={() => props.validatedHandler(filtered)}
          className={`button ${styles.up_btn}`}
        >
          Add Group
        </button>
        <button
          onClick={(e) => props.restart(e)}
          className={`button ${styles.restart_btn}`}
        >
          Restart
        </button>
      </div>
    );
  } else {
    return (
      <div className={`description blanket ${styles.scroll_blanket}`}>
        <h2>Oops!</h2>
        <p>
          Something went wrong on our end. Make sure your spreadsheet looks like
          the example below and give it another shot.
        </p>
        <button
          onClick={(e) => props.restart(e)}
          className={`button ${styles.restart_btn}`}
        >
          Restart
        </button>
      </div>
    );
  }
};

export default Verify;
