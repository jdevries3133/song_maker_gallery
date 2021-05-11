import React, { useState } from "react";
import axios from "axios";
import { render, fireEvent, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import { useLiveSongData } from "./use_live_song_data";

jest.mock("axios");
axios.post.mockImplementation(async (s) => {
  return {
    data: { songId: s },
  };
});

/**
 * This is a test fixture that just changes the songId based on the value
 * in a test input, which allows us to test the underlying LiveUpdatingTile
 * using react-testing-library
 */
const Fixture = () => {
  const [songId, setSongId] = useState("1234123412341234");
  useLiveSongData(songId);
  return (
    <div>
      <input
        data-testid="changeSongId"
        type="text"
        value={songId}
        onChange={(e) => setSongId(e.target.value)}
      />
    </div>
  );
};

/**
 * Utility function to change the songId assuming the above fixture is
 * rendered
 */
const changeSongIdTo = (songId) => {
  fireEvent.change(screen.getByTestId("changeSongId"), {
    target: { value: songId },
  });
};

describe("useLiveSongData hook", () => {
  beforeEach(() => render(<Fixture />));
  afterEach(() => axios.post.mockClear());

  it("fetches song data from api", async (done) => {
    changeSongIdTo("1234123412341234");
    expect(axios.post).toHaveBeenCalledWith("/api/gallery/song_data/", {
      songId: "1234123412341234",
    });
    done();
  });
  it("caches data to avoid excessive api hits", () => {
    expect(axios.post).toHaveBeenCalledTimes(1);
    // first change causes api hit
    changeSongIdTo("1234567812345678");
    expect(axios.post).toHaveBeenCalledWith("/api/gallery/song_data/", {
      songId: "1234567812345678",
    });
    // once for initial render, again on change
    expect(axios.post).toHaveBeenCalledTimes(2);

    // changing songId back should *not* cause an api hit, because datais
    // in the cache
    changeSongIdTo("1234123412341234");
    expect(axios.post).toHaveBeenCalledTimes(2);
  });
});
