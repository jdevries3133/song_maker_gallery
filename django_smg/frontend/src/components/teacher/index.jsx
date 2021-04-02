import React from "react";

// import Header from "./header";
import ListGalleries from "./list_galleries";

import { Div } from "Styles";

import LogoutButton from "./header/logout_button";
import { Home } from "./home";

export default () => {
  return (
    <Div>
      <LogoutButton />
      <Home />
      <ListGalleries />
    </Div>
  );
};
