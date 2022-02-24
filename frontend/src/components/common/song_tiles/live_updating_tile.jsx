import React from "react";
import styled from "styled-components";

import { SongPreview } from "./song_preview";
import { useLiveSongData } from "./use_live_song_data";

const S = styled.div`
  & > svg {
    border-radius: 20px;
  }
`;

/**
 * Integration of DynamicTile and useLiveSongData in order to provide
 * a tile that updates every time the songId changes, including all the
 * caching functionality of useLiveSongData
 */
export const LiveUpdatingTile = ({ initialSong, songId, width }) => {
  const song = useLiveSongData(songId, initialSong);
  return song ? (
    <S>
      <SongPreview song={song} width={width} />{" "}
    </S>
  ) : null;
};
