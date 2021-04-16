import React from "react";

// use later for a detail view...
// import { DynamicTile } from "../../gallery/tilegrid/DynamicTile";
import { P, H4, SocialEventContainer } from "Styles";

// TODO: this will need to be connected to a redux action to approve comments
export const Comment = ({ username, song, value }) => (
  <SocialEventContainer>
    <H4>
      {username} commented on {song.name}'s song
    </H4>
    <P left>{value}</P>
  </SocialEventContainer>
);
