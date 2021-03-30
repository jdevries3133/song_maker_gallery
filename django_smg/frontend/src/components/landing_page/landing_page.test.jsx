import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";

import { Context as C } from "Test/app_context.js";

import { LandingPage } from "./index";

describe("Landing page", () => {
  it("Matches snapshot", () => {
    expect(
      renderer
        .create(
          <C>
            <LandingPage />
          </C>
        )
        .toJSON()
    ).toMatchSnapshot();
  });
});
