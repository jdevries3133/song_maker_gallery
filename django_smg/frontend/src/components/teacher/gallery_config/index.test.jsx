import React from "react";
import { Context } from "Common/storybook_util";

import { render } from "@testing-library/react";
import "@testing-library/jest-dom";

import { GalleryConfigPage } from "./index";

it("renders without error", () => {
  render(
    <Context>
      <GalleryConfigPage />
    </Context>
  );
});
