import React from "react";
import styled, { Div, H4 } from "Styles";

import { TILE_COLORS } from "./constants";
import { useSongRect } from "./useSongRect";

const OuterContainer = styled(Div)`
  display: inline-block;
  text-align: left;

  &:nth-child(7n + 0):hover svg {
    background-color: ${TILE_COLORS[0]};
  }

  &:nth-child(7n + 1):hover svg {
    background-color: ${TILE_COLORS[1]};
  }

  &:nth-child(7n + 2):hover svg {
    background-color: ${TILE_COLORS[2]};
  }

  &:nth-child(7n + 3):hover svg {
    background-color: ${TILE_COLORS[3]};
  }

  &:nth-child(7n + 4):hover svg {
    background-color: ${TILE_COLORS[4]};
  }

  &:nth-child(7n + 5):hover svg {
    background-color: ${TILE_COLORS[5]};
  }

  &:nth-child(7n + 6):hover svg {
    background-color: ${TILE_COLORS[6]};
  }

  &:hover rect {
    opacity: 0;
    stroke: var(--purple);
    stroke-width: 8px;
    transition: 100ms;
  }
  &:hover text {
    opacity: 100;
  }
`;

const StyledSvg = styled.svg`
  border-radius: 10px;
  transition: 100ms;

  }
`;

const StyledText = styled.text`
  font: bold 40px "Indie Flower";
  fill: white;
  transition: 100ms;
  opacity: 0;
`;

const StaticNameCard = styled(H4)`
  margin: 1.5rem 0 0 0;
  display: inline-block;
  background-color: white;
  border-radius: 10px;
  box-shadow: 5px 5px 5px lightgray;
  padding: 0.8rem;
  font-size: 24px;
`;

const InnerContainer = styled(Div)`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  display: inline-block;
  background-color: white;
  box-shadow: 5px 5px 8px #ddd;
  margin: 10px;

  &:hover {
    border-radius: 20px;
  }
`;

export const Layout = (props) => {
  const rects = useSongRect(props.song, props.tileSize);
  return (
    <OuterContainer>
      {props.mobile ? (
        <div style={{ textAlign: "left" }}>
          <StaticNameCard>{props.song.student_name}</StaticNameCard>
        </div>
      ) : null}
      <InnerContainer
        width={`${props.tileSize.width}px`}
        height={`${props.tileSize.height}px`}
      >
        <a
          href={
            "https://musiclab.chromeexperiments.com/Song-Maker/song/" +
            `${props.song.songId}`
          }
          target="_blank"
          rel="noopner noreferrer"
        >
          <StyledSvg
            viewBox={`0 0 ${props.tileSize.width} ${props.tileSize.height}`}
            xmlns="https://www.w3.org/2000/svg"
          >
            <StyledText
              dominantBaseline="middle"
              textAnchor="middle"
              x="50%"
              y="50%"
            >
              {props.mobile ? "View Song" : props.song.student_name}
            </StyledText>
            {rects}
          </StyledSvg>
        </a>
      </InnerContainer>
    </OuterContainer>
  );
};
