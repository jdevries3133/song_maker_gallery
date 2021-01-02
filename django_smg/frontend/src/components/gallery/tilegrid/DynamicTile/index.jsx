import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Song } from "./MidiParser/Parser";
import { RectGenerator, GridGenerator } from "./svgGenerators";
import { validateWidthHeight } from "./customPropTypes";
import { ASPECT_RATIO } from "./constants";

export const DynamicTile = (props) => {
  /*
   * DynamicTile component takes only one required prop: "songId".
   * This prop should be the sixteen digit ID associated with a song
   * from the Music Lab Song Maker, and it's type should be a string. Height
   * or width (integers) are optional props which will cause the component
   * to render at that dimension in pixels. Height and width are mutually
   * exclusive; the component renders at a fixed aspect ratio so do not
   * pass them together.
   *
   * Due to google's CORS policy, this component cannot work in isolation.
   * It is impossible to request the MIDI file and JSON data from Google
   * directly from the client browser. Instead, it is necessary for a
   * backend to exist where you have cached the MIDI and JSON data from
   * the song maker. Endpoints where this component searches for that
   * information are listed in src/constants.js.
   */

  // State variables become parsed Song object instance. Using useState because
  // we need to trigger a re-render once the song is fetched and parsed.
  const [song, setSong] = useState(null);
  useEffect(() => {
    // fetch and parse Song object
    const songObj = new Song(props.songId);
    songObj.parse().then(() => {
      setSong(songObj);
    });
  }, [props.songId]);
  // width or height are undefined. ensure that they are both defined
  let pixelWidth;
  let pixelHeight;
  if (props.totalWidthPixels) {
    pixelWidth = props.totalWidthPixels;
    pixelHeight = Math.floor(pixelWidth / ASPECT_RATIO);
  } else if (props.totalHeightPixels) {
    pixelHeight = props.totalHeightPixels;
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
  songId: PropTypes.string.isRequired,
  pixelWidth: validateWidthHeight,
  pixelHeight: validateWidthHeight,
};

DynamicTile.defaultProps = {
  totalWidthPixels: 600,
};
