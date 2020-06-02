import React, { useState, Fragment } from "react";
import StyledDropdownButton from "./styled.dropdown_button";
import styles from "./add_gallery.module.css";
import { ThemeProvider } from "styled-components";

const staged_group = (props) => {
  const [show, setShow] = useState(false);
  const groupname = [...props.group].pop();
  const group = [...props.group].slice(0, -1);
  // console.log(group);
  return (
    <Fragment>
      <tr>
        <td>
          <ThemeProvider theme={show ? { rotation: 270 } : { rotation: 180 }}>
            <StyledDropdownButton onClick={() => setShow(!show)}>
              &#9664;
            </StyledDropdownButton>
          </ThemeProvider>
        </td>
        <td style={{ fontSize: "24px" }}>{groupname}</td>
        <td>
          <button
            className={styles.restart_btn}
            onClick={() => props.unStageGroupHandler(groupname)}
          >
            Unstage Group
          </button>
        </td>
      </tr>
      <tr>
        <td />
        <td width="80%">
          <table className={styles.blanket_table}>
            <tbody>
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
                      <tr key={index + student}>
                        <td align="left">{display}</td>
                        <td align="left">{student[1].slice(0, 20)}...</td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </td>
        <td />
      </tr>
    </Fragment>
  );
};

export default staged_group;
