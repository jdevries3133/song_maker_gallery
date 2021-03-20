import React, { useState, Fragment } from "react";
import StyledDropdownButton from "./styled.dropdown_button";
import styles from "./add_gallery.module.css";
import { ThemeProvider } from "styled-components";

export const StagedGroupBody = (props) => {
  const group = [...props.group].slice(0, -1);
  let display;
  return group.map((student, index) => {
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
        display = name_arr[0] + " " + last_initial + ".";
      } else {
        display = name_arr[0];
      }
    } else {
      display = name_arr[0];
    }
    return (
      <tr data-testid="dropdownRow" key={index + student}>
        <td data-testid="sgName" align="left">
          {display}
        </td>
        <td data-testid="sgLink" align="left">
          {student[1].slice(0, 30)}...
        </td>
      </tr>
    );
  });
};

const staged_group = (props) => {
  const [show, setShow] = useState(false);
  const groupname = [...props.group].pop();
  return (
    <Fragment>
      <table style={{ margin: "auto", marginTop: "15px" }}>
        <tbody>
          <tr>
            <td>
              <ThemeProvider
                theme={show ? { rotation: 270 } : { rotation: 180 }}
              >
                <StyledDropdownButton
                  data-testid="sgToggleDropdown"
                  onClick={() => setShow(!show)}
                >
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
        </tbody>
      </table>
      <table className={styles.blanket_table}>
        <tbody>{show ? <StagedGroupBody group={props.group} /> : null}</tbody>
      </table>
    </Fragment>
  );
};

export default staged_group;
