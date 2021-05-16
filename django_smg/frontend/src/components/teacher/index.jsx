import React from "react";
import { Switch, Route } from "react-router";

import { Div } from "Styles";

import ListGalleries from "./list_galleries";
import LogoutButton from "./header/logout_button";
import { Home } from "./home";
import { GalleryForm } from "./gallery_form/gallery_form";
import { DemoGallery } from "./demo_gallery";

// temp
import sampleGallery from "../landing_page/sample_gallery.json";

export default () => {
  return (
    <Div>
      <Switch>
        <Route path="/">
          <LogoutButton />
          <Home />
          <ListGalleries />
        </Route>
        <Route path="/form">
          <GalleryForm gallery={sampleGallery} />
        </Route>
        <Route path="/teacher/demo">
          <DemoGallery gallery={sampleGallery} />
        </Route>
      </Switch>
    </Div>
  );
};
