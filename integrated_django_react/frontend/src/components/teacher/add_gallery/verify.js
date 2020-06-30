import React, { useState } from "react";
import styles from "./add_gallery.module.css";

const Verify = (props) => {
  var nameIndex = props.nameIndex;
  var linkIndex = props.linkIndex;
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
    filtered = props.csv.data.filter((row) => {
      // handle csvs with blankline at the end of the file
      if (row.length < 2) {
        return null;
      }
      return [row[nameIndex], row[linkIndex]];
    });
  } else {
    if (nameIndex == undefined) {
      return (
        <div className={`description blanket ${styles.scroll_blanket}`}>
          <h2>Whoops!</h2>
          <p>
            It looks like your spreadsheet didn't have a header of "name," can
            you select the column that contains <b>names?</b>
          </p>
          {props.csv.data[0].map((row, index) => {
            return (
              <button
                key={index}
                onClick={() => {
                  props.indexHandler(index, "name");
                }}
              >
                {row}
              </button>
            );
          })}
          <button
            onClick={(e) => props.restart(e)}
            className={`button ${styles.restart_btn}`}
          >
            Restart
          </button>
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
          {props.csv.data[0].map((row, index) => (
            <button
              key={index}
              onClick={() => props.indexHandler(index, "link")}
            >
              {row}
            </button>
          ))}
          <button
            onClick={(e) => props.restart(e)}
            className={`button ${styles.restart_btn}`}
          >
            Discard and Start Over
          </button>
        </div>
      );
    }
  }
  if (typeof filtered != undefined) {
    return (
      <div className={`description blanket ${styles.scroll_blanket}`}>
        <h2 className={styles.doesThisLookGood}>Does this look good?</h2>
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
          Discard and Start Over
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
