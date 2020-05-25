import React, { useState, Fragment } from "react";
import styles from "./teacher.module.css";

const Verify = (props) => {
  const [nameIndex, setNameIndex] = useState(undefined);
  const [linkIndex, setLinkIndex] = useState(undefined);
  const [filteredData, setFilteredData] = useState(false);

  const data = props.csv.data;
  console.log("data", data);

  for (let i = 0; i < data[0].length; i++) {
    if (data[0][i].toLowerCase() === "name") {
      if (nameIndex == undefined) {
        setNameIndex(i);
      }
    } else if (
      data[0][i].toLowerCase() === "links" ||
      data[0][i].toLowerCase() === "link"
    ) {
      if (linkIndex == undefined) {
        console.log(linkIndex);
        setLinkIndex(i);
      }
    }
  }
  console.log("after for", nameIndex, linkIndex); // after for
  console.log("filt data", filteredData);
  if (typeof filteredData === "boolean") {
    console.log("ran2");
    console.log("undefined", nameIndex, linkIndex);
    if (typeof nameIndex === "number" && typeof linkIndex === "number") {
      var filtered = [...data].filter((row) => {
        return [row[nameIndex], row[linkIndex]];
      });
      console.log("local", filtered);
    }
  }
  console.log(filtered);
  setFilteredData(filtered);
  if (nameIndex == undefined) {
    return (
      <Fragment>
        <h2>Whoops!</h2>
        <p>
          It looks like your spreadsheet didn't have a header of "name," can you
          select the column that contains <b>names?</b>
        </p>
        {data[0].map((row, index) => {
          <button
            onClick={() => {
              setNameIndex(index);
            }}
          >
            {row}
          </button>;
        })}
      </Fragment>
    );
  } else if (linkIndex == undefined) {
    return (
      <Fragment>
        <h2>Whoops!</h2>
        <p>
          It looks like your spreadsheet didn't have a header of "link," can you
          select the column that contains <b>links?</b>
        </p>
        {data[0].map((row, index) => {
          <button onClick={() => setLinkIndex(index)}>{row}</button>;
        })}
      </Fragment>
    );
  }

  filteredData.shift();

  return (
    <div className="blanket">
      <h2>Does this look good?</h2>
      <table>
        <tbody>
          <tr>
            <td>Name</td>
            <td>Link</td>
          </tr>
          {filteredData.map((row) => (
            <tr>
              <td>{row[nameIndex]}</td>
              <td>{row[linkIndex]}</td>
            </tr>
          ))}
          }
        </tbody>
      </table>
    </div>
  );
};

export default Verify;
