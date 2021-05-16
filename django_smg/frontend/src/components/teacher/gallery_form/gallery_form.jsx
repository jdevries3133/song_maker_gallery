import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import { Link } from "react-router-dom";

import { H1, Button, Grid } from "Styles";

import { GroupForm } from "./group_form";
import { HeaderForm } from "./header_form";

export const GalleryForm = ({ gallery }) => {
  const saveAndRedirectToDemo = () => {};
  return (
    <DndProvider backend={HTML5Backend}>
      <H1>Gallery Form</H1>
      <Grid>
        <Link to={`/teacher/demo/${gallery.slug}/`}>
          <Button onClick={saveAndRedirectToDemo}>Demo Gallery</Button>
        </Link>
      </Grid>
      <HeaderForm title={gallery.title} description={gallery.description} />

      {gallery.song_groups.map((group, i) => (
        <GroupForm key={group.group_name + i} group={group} />
      ))}
    </DndProvider>
  );
};
