import React from "react";

import styled from "Styles";

import { SongPreview } from "Common/song_tiles";

export const SocialEventContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;

  background-color: ${(props) => props.background || "#d9e6e8"};
  border-radius: 30px;
  margin: 1rem 0;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #79a8af;
  border-radius: 20px 0 0 20px;
  height: 100%;
`;

const Text = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
`;

const P = styled.p`
  font-size: max(1rem, 3vw);
`;

export const Reaction = (props) => {
  return (
    <SocialEventContainer>
      <IconContainer>{props.icon}</IconContainer>
      <Text>
        <P>
          <b>{props.username}</b> reacted to <b>{props.song.name}'s</b> song
        </P>
      </Text>
      <SongPreview song={props.song} />
    </SocialEventContainer>
  );
};
