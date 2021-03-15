import React from "react";
import Gallery from "./gallery";

import { render } from "../../test/redux_wrap";

it("renders without errors", () => {
  render(<Gallery slug="test-slug" />, {
    gallery: {
      title: "title",
      description: "description",
      songData: [],
    },
  });
});
