import React, { useEffect, useState, Fragment } from "react";
import PropTypes from "prop-types";
import { Song } from "./MidiParser/Parser.js";
import { RectGenerator, GridGenerator } from "./svgGenerators";
import { ASPECT_RATIO } from "./constants";
import styles from "./DynamicTile.module.css";

export const DynamicTile = (props) => {
  // State variables become parsed Song object instance. Using useState because
  // we need to trigger a re-render once the song is fetched and parsed.
  const [song, setSong] = useState(null);
  useEffect(() => {
    // fetch and parse Song object
    const songObj = new Song(props.song);
    songObj.parse();
    setSong(songObj);
  }, [props.song]);
  // width or height are undefined. ensure that they are both defined
  const pixelWidth = props.pixelWidth;
  let pixelHeight = Math.floor(pixelWidth / ASPECT_RATIO);
  // generate rects once midi has been parsed
  let rectGenerator;
  let gridGenerator;
  if (song && song.isParsed) {
    const gridSize = {
      pixelHeight,
      pixelWidth,
    };
    rectGenerator = new RectGenerator(song, gridSize);
    gridGenerator = new GridGenerator(song, gridSize);
    // generate grid outside try/catch because it should not throw errors.
    gridGenerator.generateGrid();
    try {
      // will throw error if unexpected midi event type occurs
      rectGenerator.generateRects();
    } catch (e) {
      // TODO: logging entrypoint for unexpected midi event types
      console.log(e);
    }
  }
  const tileSize = {
    width: pixelWidth + "px",
    height: pixelHeight + "px",
  };
  return (
    <div className={styles.tile_outer_container}>
      {props.mobile ? (
        <div style={{ textAlign: "left" }}>
          <h4 className={styles.mobile_student_name}>{props.song.name}</h4>
        </div>
      ) : null}
      <div
        className={styles.tile_inner_container}
        style={{
          width: tileSize.width,
          height: tileSize.height,
        }}
      >
        <a
          className={styles.a__svg}
          href={`https://musiclab.chromeexperiments.com/Song-Maker/song/${props.song.songId}`}
          target="_blank"
          rel="noopner noreferrer"
        >
          <svg
            // Prettier formats this very stupidly
            // What is happening here is that "px" is being chopped off the end
            // of the width and height strings.
            viewBox={`0 0 ${tileSize.width.slice(
              0,
              -2
            )} ${tileSize.height.slice(0, -2)}`}
            xmlns="https://www.w3.org/2000/svg"
            className={styles.tile__svg}
          >
            <text
              dominantBaseline="middle"
              textAnchor="middle"
              x="50%"
              y="50%"
              className={styles.svg__text}
            >
              {props.mobile ? "View Song" : props.song.name}
            </text>
            {rectGenerator ? rectGenerator.rects : null}
            {gridGenerator ? gridGenerator.grid : null}
          </svg>
        </a>
      </div>
    </div>
  );
};

DynamicTile.propTypes = {
  song: PropTypes.object.isRequired,
  pixelWidth: PropTypes.number,
};

DynamicTile.defaultProps = {
  pixelWidth: 600,
};
