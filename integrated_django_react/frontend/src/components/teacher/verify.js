import React, { useState, useEffect, Fragment } from "react";
import styles from "./teacher.module.css";

const Verify = (props) => {
  const [state, setState] = useState({
    filteredData: [],
    nameIndex: undefined,
    linkIndex: undefined,
  });
  useEffect(() => {
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
    const filtered = [...props.csv.data].filter((row) => {
      return [row[nameIndex], row[linkIndex]];
    });
    setState({
      filteredData: filtered,
      nameIndex: nameIndex,
      linkIndex: linkIndex,
    });
  }, [props.csv]);

  if (state.nameIndex == undefined) {
    return (
      <Fragment>
        <h2>Whoops!</h2>
        <p>
          It looks like your spreadsheet didn't have a header of "name," can you
          select the column that contains <b>names?</b>
        </p>
        {props.csv.data[0].map((row, index) => {
          <button
            onClick={() => {
              setState({
                nameIndex: index,
              });
            }}
          >
            {row}
          </button>;
        })}
      </Fragment>
    );
  } else if (state.linkIndex == undefined) {
    return (
      <Fragment>
        <h2>Whoops!</h2>
        <p>
          It looks like your spreadsheet didn't have a header of "link," can you
          select the column that contains <b>links?</b>
        </p>
        {props.csv.data[0].map((row, index) => {
          <button onClick={() => setLinkIndex(index)}>{row}</button>;
        })}
      </Fragment>
    );
  }
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
            state.filteredData.slice(1).map((row, index) => {
              var name_arr = row[state.nameIndex].split(" ");

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
                  <td align="left">{row[state.linkIndex].slice(0, 30)}...</td>
                </tr>
              );
            })
          }
        </tbody>
      </table>
      <button
        //onClick={props.validatedHandler(...state.filteredData)}
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
};

export default Verify;
