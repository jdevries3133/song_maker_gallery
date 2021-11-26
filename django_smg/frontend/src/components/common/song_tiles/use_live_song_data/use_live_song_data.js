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

const validateSongId = (songId) => {
  return songId && songId.length === 16 && isNumeric(songId);
};

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

export const useLiveSongData = (songId, initialSong) => {
  const [songData, setSongData] = useState(initialSong);

  useEffect(() => {
    /**
     * Only fetch if:
     *
     * a) there is no song data
     * b) the song data is out of sync with the songId
     * c) the songId is valid
     */
    if ((!songData || songData.songId !== songId) && validateSongId(songId)) {
      fetchSongData(songId).then(({ data }) => {
        setSongData(data);
      });
    }
  }, [songId]);

  return songData;
};
