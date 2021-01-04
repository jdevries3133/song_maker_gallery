import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Song } from "./MidiParser/Parser.js";
import { RectGenerator, GridGenerator } from "./svgGenerators";
import { validateWidthHeight } from "./customPropTypes";
import { ASPECT_RATIO } from "./constants";

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
  let pixelWidth;
  let pixelHeight;
  if (props.pixelWidth) {
    pixelWidth = props.pixelWidth;
    pixelHeight = Math.floor(pixelWidth / ASPECT_RATIO);
  } else if (props.pixelHeight) {
    pixelHeight = props.pixelHeight;
    pixelWidth = Math.floor(pixelHeight * ASPECT_RATIO);
  }
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
    <div
      style={{
        display: "inline-block",
        width: tileSize.width,
        height: tileSize.height,
        backgroundColor: "white",
        boxShadow: "5px 10px 10px #888888",
      }}
    >
      <svg
        // Prettier formats this very stupidly
        // What is happening here is that "px" is being chopped off the end
        // of the width and height strings.
        viewBox={`0 0 ${tileSize.width.slice(0, -2)} ${tileSize.height.slice(
          0,
          -2
        )}`}
        xmlns="https://www.w3.org/2000/svg"
      >
        {rectGenerator ? rectGenerator.rects : null}
        {gridGenerator ? gridGenerator.grid : null}
      </svg>
    </div>
  );
};

DynamicTile.propTypes = {
  song: PropTypes.object,
  pixelWidth: validateWidthHeight,
  pixelHeight: validateWidthHeight,
};

DynamicTile.defaultProps = {
  totalWidthPixels: 600,
};
