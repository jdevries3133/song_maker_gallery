import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";
import { MemoryRouter } from "react-router-dom";

import { TosContent } from "./terms_of_service";
import { PrivacyContent } from "./privacy_policy";

describe("legal views", () => {
  test("terms of service content matches snapshot", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <TosContent />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("privacy policy content matches snapshot", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PrivacyContent />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
