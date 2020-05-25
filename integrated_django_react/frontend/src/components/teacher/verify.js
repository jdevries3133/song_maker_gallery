import React, { useState, useEffect, Fragment } from "react";
import styles from "./teacher.module.css";

const Verify = (props) => {
  const [state, setState] = useState({
    filteredData: [],
    nameIndex: undefined,
    linkIndex: undefined,
    firstCycle: true,
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
      firstCycle: false,
    });
  }, [props.csv]);

  if (state.firstCycle) {
    return <h1>Loading</h1>;
  }
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
    <div className="blanket">
      <h2>Does this look good?</h2>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>Link</td>
          </tr>
          {state.filteredData.map((row) => (
            <tr>
              <td>{row[state.nameIndex]}</td>
              <td>{row[state.linkIndex]}</td>
            </tr>
          ))}
          }
        </tbody>
      </table>
    </div>
  );
};

export default Verify;
