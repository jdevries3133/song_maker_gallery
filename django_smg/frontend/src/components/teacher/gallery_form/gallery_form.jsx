import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { H1 } from "Styles";

import { Nav } from "./nav";
import { GroupForm } from "./group_form";
import { HeaderForm } from "./header_form";

export const GalleryForm = ({ gallery }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <Nav slug={gallery.slug} />
      <H1>Gallery Form</H1>
      <HeaderForm gallery={gallery} />

      {gallery.song_groups.map((group, i) => (
        <GroupForm key={group.group_name + i} group={group} />
      ))}
    </DndProvider>
  );
};
