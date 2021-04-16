import React from "react";

import { Comment as CommentIcon } from "Common/icon";
import styled, { H4 as DefaultH4 } from "Styles";

import { SongPreview } from "./styled_preview";
import { SocialEventContainer, IconContainer } from "./reaction";

const Text = styled.div`
  margin-left: 1rem;
`;

const H4 = styled(DefaultH4)`
  font-weight: normal;
  font-size: max(1rem, 3vw);
`;

const P = styled.p`
  margin-left: 0;
  font-style: italic;
  font-size: max(0.8rem, 2vw);
`;

// TODO: this will need to be connected to a redux action to approve comments
export const Comment = ({ username, song, value }) => (
  <SocialEventContainer>
    <IconContainer>
      <CommentIcon />
    </IconContainer>
    <Text>
      <H4>
        <b>{username}</b> commented on <b>{song.name}'s</b> song
      </H4>
      <P>{value}</P>
    </Text>
    <SongPreview song={song} />
  </SocialEventContainer>
);
