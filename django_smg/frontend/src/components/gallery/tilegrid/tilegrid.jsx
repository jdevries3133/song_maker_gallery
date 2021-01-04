/**
 * ### Name Display
 *
 * The dynamic tile does not display the student's name or take it as a prop,
 * yet I want to maintain the animation as it has been already. Will it be
 * best to try to maintain a mostly-css animation as I have done, or do respond
 * to make a javascript animation by unmounting the dynamic tile component,
 * and transitioning to a name display component?
 */

import React from "react";
import { DynamicTile } from "./DynamicTile";
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
        {props.data.slice(0, -1).map((song, index) => (
          <DynamicTile song={song} pixelWidth={150} key={song.songId + index} />
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
        {props.data.slice(0, -1).map((song, index) => (
          <DynamicTile song={song} pixelWidth={150} key={song.songId + index} />
        ))}
      </ul>
    </div>
  );
};

export default tileGrid;
