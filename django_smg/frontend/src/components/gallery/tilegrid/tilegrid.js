import React from "react";
import Tile from "./tile";
import useWidth from "../../generics/useWidth";
import styles from "./tilegrid.module.css";

const tileGrid = (props) => {
  const group_name = props.data.slice(-1);
  const { width } = useWidth();
  return width > 475 ? (
    <div id="gallery">
      <div className={styles.tg_top_space} />
      <a href="#gallery_top">
        <h2 className={styles.tg_title} id={group_name}>
          {group_name}
        </h2>
        <br />
        <span className={styles.back_finger}>☟</span>
      </a>
      <ul className={styles.tgrid}>
        {props.data.slice(0, -1).map((student, index) => (
          <Tile
            group={group_name}
            st_arr={student}
            key={group_name + student + Math.random().toString()}
            index={index % 6}
          />
        ))}
      </ul>
    </div>
  ) : (
    <div>
      <div className={styles.tg_top_space} id="gallery" />
      <h2 className={styles.tg_title_mobile} id={group_name}>
        {group_name}
      </h2>
      <br />
      <a href="#gallery_top">
        <button>
          <span className={styles.finger}>☟</span>
          <br />
          <span>Top</span>
        </button>
      </a>
      <ul className={styles.tgrid}>
        {props.data.slice(0, -1).map((student, index) => (
          <Tile
            group={group_name}
            st_arr={student}
            key={group_name + student + Math.random().toString()}
            index={index}
          />
        ))}
      </ul>
    </div>
  );
};

export default tileGrid;
