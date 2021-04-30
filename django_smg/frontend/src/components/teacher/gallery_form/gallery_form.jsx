import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

import { H1, Button, Grid } from "Styles";

import { GroupForm } from "./group_form";
import { HeaderForm } from "./header_form";

export const GalleryForm = ({ gallery }) => (
  <DndProvider backend={HTML5Backend}>
    <H1>Gallery Form</H1>
    <Grid>
      <Button>Demo Gallery</Button>
    </Grid>
    <HeaderForm title={gallery.title} description={gallery.description} />

    {gallery.songData.map((group, i) => (
      <GroupForm key={group.slice(-1) + i} group={group} />
    ))}
  </DndProvider>
);
