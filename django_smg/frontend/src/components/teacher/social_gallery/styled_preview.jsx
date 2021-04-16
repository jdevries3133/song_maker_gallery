/**
 * TODO: move to common at the same time DynamicTile is moved to common
 */

import { useSongRect } from "../../gallery/tilegrid/DynamicTile/useSongRect";

import styled from "styled-components";

const StyledPreview = styled.svg`
  background-color: #ecf3f4;
  border-radius: 0 20px 20px 0;
  height: 100%;
  width: 100%;
`;

export const SongPreview = ({ song }) => {
  const rects = useSongRect(song, {
    width: 100,
    height: 100,
  });
  return <StyledPreview viewBox="0 0 100 100">{rects}</StyledPreview>;
};
