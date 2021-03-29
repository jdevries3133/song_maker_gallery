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
    songObj.parse();
    setSong(songObj);
  }, [song]);

  // generate rects once midi has been parsed
  let rectGenerator;
  if (parsedSong && parsedSong.isParsed) {
    rectGenerator = new RectGenerator(parsedSong, gridSize);
    rectGenerator.generateRects();
  }
  return rectGenerator?.rects || null;
};
