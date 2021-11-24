import { useEffect, useState } from "react";
import axios from "axios";

jest.mock("axios");
axios.post.mockResolvedValue(() => {
  data: {
  }
});

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

export const useLiveSongData = (songId) => {
  const [songData, setSongData] = useState(null);

  useEffect(() => {
    if (validateSongId(songId)) {
      fetchSongData(songId).then(({ data }) => {
        setSongData(data);
      });
    }
  }, [songId]);

  return songData;
};
