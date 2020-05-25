import React, { useState } from "react";
import styles from "./teacher.module.css";

const staged_group = (props) => {
  const [show, setShow] = useState(false);
  const groupname = [...props.group].pop();
  console.log(props.group);
  return (
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
      <button onClick={() => props.unStageGroupHandler(groupname)}>
        Unstage Group
      </button>
    </tr>
  );
};

export default staged_group;
