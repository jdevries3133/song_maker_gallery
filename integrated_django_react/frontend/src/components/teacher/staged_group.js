import React, { useState, Fragment } from "react";
import styles from "./teacher.module.css";

const staged_group = (props) => {
  const [show, setShow] = useState(false);
  const groupname = [...props.group].pop();
  const group = [...props.group].slice(0, -1);
  // console.log(group);
  return (
    <Fragment>
      <tr>
        <td>
          <button
            className={styles.dropdown_arrow}
            onClick={() => setShow(!show)}
          >
            &#9664;
          </button>
        </td>
        <td>{groupname}</td>
        <td>
          <button onClick={() => props.unStageGroupHandler(groupname)}>
            Unstage Group
          </button>
        </td>
      </tr>
      {show
        ? group.map((student, index) => {
            // mmmmm spaghetti
            const name_arr = student[0].split(" ");

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
                <td align="left">{student[1].slice(0, 20)}...</td>
              </tr>
            );
          })
        : null}
    </Fragment>
  );
};

export default staged_group;
