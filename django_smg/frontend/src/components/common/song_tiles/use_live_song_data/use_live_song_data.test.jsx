import React, { useState } from "react";
import axios from "axios";
import { act, waitFor, render, screen } from "@testing-library/react";
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
  const data = useLiveSongData(songId);
  return (
    <div>
      <input
        data-testid="changeSongId"
        type="text"
        value={songId}
        onChange={(e) => setSongId(e.target.value)}
      />
      {JSON.stringify(data)}
    </div>
  );
};

axios.post.mockImplementation(async () => {
  return { data: { example: "songData" } };
});

describe("useLiveSongData hook", () => {
  beforeEach(() => act(async () => render(<Fixture />)));
  afterEach(() => axios.post.mockClear());

  it("fetches song data from api", async () => {
    expect(axios.post).toHaveBeenCalledWith("/api/gallery/song_data/", {
      songId: "1234123412341234",
    });
    await waitFor(() => {
      expect(screen.queryByText('{"example":"songData"}')).toBeVisible();
    });
    await new Promise((r) => setTimeout(() => r(), 50));
  });
});
