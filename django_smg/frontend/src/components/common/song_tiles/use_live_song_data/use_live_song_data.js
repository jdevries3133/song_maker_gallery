import { useEffect, useState } from "react";
import axios from "axios";

const isNumeric = (str) => {
  if (typeof str !== "string") return false; // we only process strings!
  return (
    // use type coercion to parse the _entirety_ of the string
    // (`parseFloat` alone does not do this)...
    !isNaN(str) &&
    // ...and ensure strings of whitespace fail
    !isNaN(parseFloat(str))
  );
};

const validateSongId = (songId) =>
  songId && songId.length === 16 && isNumeric(songId);

const fetchSongData = async (songId) => {
  axios.defaults.xsrfCookieName = "csrftoken";
  axios.defaults.xsrfHeaderName = "X-CSRFTOKEN";
  try {
    return await axios.post("/api/gallery/song_data/", { songId });
  } catch (e) {
    console.log(`Error: ${e}`);
    return e;
  }
};

/**
 * Use instant song data api to get data. Only hit the api if the songId
 * changes, and also cache previously entered id's to avoid repetitive API
 * calls.
 */
export const useLiveSongData = (songId) => {
  const [songData, setSongData] = useState({
    current: null,
    cache: {},
  });

  useEffect(() => {
    if (validateSongId(songId)) {
      if (
        songData.current?.songId === songId &&
        // this confirms that we have the rich songData from the API, not
        // just a little stub after initialization
        songData.current?.midi
      ) {
        return;
      }
      if (songId in songData.cache) {
        setSongData({
          current: songData.cache[songId],
          ...songData,
        });
      } else {
        fetchSongData(songId).then(({ data }) => {
          setSongData({
            current: data,
            cache: {
              [songId]: data,
              ...songData.cache,
            },
          });
        });
      }
    }
  }, [songId]);

  return songData.current;
};
