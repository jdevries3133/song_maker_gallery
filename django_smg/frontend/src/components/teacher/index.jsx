import React from "react";

// import Header from "./header";
// import AddGallery from "./add_gallery";
// import ListGalleries from "./list_galleries";

import { Div } from "../common/styles";

import LogoutButton from "./header/logout_button";
import { Home } from "./home";

export default () => {
  return (
    <Div>
      <LogoutButton />
      <Home />
    </Div>
  );
};
