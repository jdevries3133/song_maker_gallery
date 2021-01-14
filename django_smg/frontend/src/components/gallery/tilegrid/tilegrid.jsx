import React from "react";
import { DynamicTile } from "./DynamicTile";
import useWidth from "../../generics/useWidth";
import styles from "./tilegrid.module.css";

const tileGrid = (props) => {
  const group_name = props.data.slice(-1);
  const { width } = useWidth(600);
  // TODO: only re-render if width crosses the breakpoint. Otherwise, take
  // a shortcut
  return width > 600 ? (
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
          <DynamicTile song={song} pixelWidth={300} key={song.songId + index} />
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
      <div style={{ textAlign: "center" }}>
        <ul className={styles.tgrid}>
          {props.data.slice(0, -1).map((song, index) => (
            <DynamicTile
              mobile={true}
              song={song}
              pixelWidth={300}
              key={song.songId + index}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default tileGrid;
