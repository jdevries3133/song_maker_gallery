import React from "react";

import { DynamicTile } from "./dynamic_tile";
import { useLiveSongData } from "./use_live_song_data";

/**
 * Integration of DynamicTile and useLiveSongData in order to provide
 * a tile that updates every time the songId changes, including all the
 * caching functionality of useLiveSongData
 */
export const LiveUpdatingTile = ({ songId, width }) => {
  const song = useLiveSongData(songId);
  return song ? <DynamicTile song={song} width={width} /> : null;
};
