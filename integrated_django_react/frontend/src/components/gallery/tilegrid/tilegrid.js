import React from "react";

import Tile from "./tile";
import styles from "./tilegrid.module.css";

const tileGrid = (props) => {
  const group_name = props.data.pop(0);

  return (
    <div>
      <div className={styles.tg_top_space} />
      <a href="#gallery_top">
        <h2 className={styles.tg_title} name={group_name}>
          {group_name}
        </h2>
        <br />
        <span className={styles.back_finger}>☟</span>
      </a>
      <ul className={styles.tgrid}>
        {props.data.map((student, index) => (
          <Tile
            group={group_name}
            st_arr={student}
            key={group_name + student}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};

export default tileGrid;