import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { Description, H1 } from "Styles";

import { GroupForm } from "./group_form";

export const GalleryForm = ({ gallery }) => (
  <DndProvider backend={HTML5Backend}>
    <Description>
      <H1>Gallery Form</H1>
      {gallery.songData.map((group, i) => (
        <GroupForm key={group.slice(-1) + i} group={group} />
      ))}
    </Description>
  </DndProvider>
);
