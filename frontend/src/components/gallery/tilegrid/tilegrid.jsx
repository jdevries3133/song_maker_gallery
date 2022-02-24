import React from "react";
import { DynamicTile } from "Common/song_tiles";
import useWidth from "Common/useWidth";

import styled, { A, P, Button, Div, H2 } from "Styles";

const Ul = styled.ul`
  text-align: center;
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const GalleryContainer = styled(Div)`
  margin-top: 8rem;
`;

const TgTitle = styled(H2)`
  margin: 0 0 2rem 0;
  position: relative;
  z-index: 10;
  top: min(10vw, 5.9rem);
  font-size: min(6vw, 3.5rem);
  color: black;
  background-color: white;
  border-radius: 20px;
  box-shadow: 0px 3px 8px rgb(100, 100, 100);
  padding: 7px;
  transition: 0.4s ease;

  @media (max-width: 600px) {
    position: static;
    font-size: 2rem;
    border-radius: 15px;
  }

  @media (min-width: 600px) {
    &:hover {
      cursor: pointer;
      background: green;
      opacity: 0%;
    }

    &:hover ~ span {
      opacity: 100%;
      transform: rotate(180deg);
    }
  }
`;

const Finger = styled.span`
  position: relative;
  bottom: max(1.3vw, 1.7rem);
  opacity: 0%;
  color: white;
  display: inline-block;
  background-color: #5a38cc;
  border-radius: 20px;
  font-size: min(7vw, 3.5rem);
  transform: rotate(0deg);
  transition: 0.4s ease;

  @media (max-width: 600px) {
    position: static;
    background: none;
    color: black;
    opacity: 100%;
    font-family: "Noto Sans JP", sans-serif;
    font-size: 4rem;
    padding: 0;
    transform: rotate(180deg);
  }
`;

export const TileGrid = ({ data }) => {
  const { width } = useWidth(600);

  return width > 600 ? (
    <GalleryContainer id="gallery">
      <a href="#gallery_top">
        <TgTitle id={data.group_name}>{data.group_name}</TgTitle>
        <br />
        <Finger>☟</Finger>
      </a>
      <Ul>
        {data.songs.map((song, index) => (
          <DynamicTile song={song} pixelWidth={300} key={song.songId + index} />
        ))}
      </Ul>
    </GalleryContainer>
  ) : (
    <GalleryContainer id="gallery">
      <TgTitle id={data.group_name}>{data.group_name}</TgTitle>
      <A href="#gallery_top">
        <Button block>
          <Finger>☟</Finger>
          <P>Top</P>
        </Button>
      </A>
      <div style={{ textAlign: "center" }}>
        <Ul>
          {data.songs.map((song, index) => (
            <DynamicTile
              mobile={true}
              song={song}
              pixelWidth={300}
              key={song.songId + index}
            />
          ))}
        </Ul>
      </div>
    </GalleryContainer>
  );
};
