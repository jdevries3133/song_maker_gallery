import React from "react";

// use later for a detail view...
// import { DynamicTile } from "../../gallery/tilegrid/DynamicTile";
import { P, SocialEventContainer } from "Styles";

export const Reaction = (props) => (
  <SocialEventContainer>
    <P>
      {props.username} reacted to {props.song.name}'s song.
    </P>
    {props.icon}
  </SocialEventContainer>
);
