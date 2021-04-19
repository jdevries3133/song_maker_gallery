import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

import { useSongRect } from "Common/song_tiles";

const StyledPreview = styled.svg`
  background-color: #ecf3f4;
  border-radius: 0 20px 20px 0;
  height: 100%;
  width: 100%;
`;

export const SongPreview = ({ song, width = 100, height = 100 }) => {
  const rects = useSongRect(song, {
    width,
    height,
  });
  return <StyledPreview viewBox="0 0 100 100">{rects}</StyledPreview>;
};

SongPreview.propTypes = {
  song: PropTypes.object.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};
