import React from "react";
import { Switch, Route, useRouteMatch } from "react-router";

import { Div } from "Styles";

import ListGalleries from "./list_galleries";
import LogoutButton from "./header/logout_button";
import { Home } from "./home";
import { GalleryFormPage } from "./gallery_form";
import { DemoGalleryPage } from "./demo_gallery";
import { GalleryConfigPage } from "./gallery_config";

export default () => {
  const { path } = useRouteMatch();
  return (
    <Div>
      <Switch>
        <Route exact path={path}>
          <LogoutButton />
          <Home />
          <ListGalleries />
        </Route>
        <Route
          path={`${path}/:slug/edit`}
          children={<GalleryFormPage />}
        ></Route>
        <Route
          path={`${path}/:slug/demo`}
          children={<DemoGalleryPage />}
        ></Route>
        <Route
          path={`${path}/:slug/settings`}
          children={<GalleryConfigPage />}
        />
      </Switch>
    </Div>
  );
};
