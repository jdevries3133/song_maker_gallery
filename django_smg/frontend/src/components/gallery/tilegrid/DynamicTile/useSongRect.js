import { useState, useEffect } from "react";

import { Song } from "./Parser.js";
import { RectGenerator } from "./rectGenerator.js";

/**
 * @returns Array[<rect>] || null
 */
export const useSongRect = (song, gridSize) => {
  // State variables become parsed Song object instance. Using useState because
  // we need to trigger a re-render once the song is fetched and parsed.
  const [parsedSong, setSong] = useState(null);

  useEffect(() => {
    // fetch and parse Song object
    const songObj = new Song(song);
    try {
      songObj.parse();
    } catch (e) {
      console.log("song parsing failed", e);
      return;
    }
    setSong(songObj);
  }, [song]);

  // generate rects once midi has been parsed
  let rectGenerator;
  if (parsedSong && parsedSong.isParsed) {
    try {
      rectGenerator = new RectGenerator(parsedSong, gridSize);
      rectGenerator.generateRects();
    } catch (e) {
      console.log("rect generation failed", e);
      return;
    }
  }
  return rectGenerator?.rects || null;
};
