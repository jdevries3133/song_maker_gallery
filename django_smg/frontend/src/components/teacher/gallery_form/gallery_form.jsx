import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import styled, { H1 as DefaultH1, Description } from "Styles";

import { GroupForm } from "./group_form";
import { HeaderForm } from "./header_form";

const H1 = styled(DefaultH1)`
  margin-top: 5rem;
`;

export const GalleryForm = ({ gallery }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <H1>Gallery Form</H1>
      <HeaderForm gallery={gallery} />

      {gallery.song_groups ? (
        gallery.song_groups.map((group, i) =>
          group.songs ? (
            <GroupForm key={group.group_name + i} group={group} />
          ) : (
            <Description>
              <h3>No songs in this group yet!</h3>
            </Description>
          )
        )
      ) : (
        <Description>
          <h3>No songs in this gallery yet!</h3>
        </Description>
      )}
    </DndProvider>
  );
};
