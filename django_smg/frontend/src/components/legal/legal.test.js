import React from "react";
import renderer from "react-test-renderer";
import { MemoryRouter } from "react-router-dom";

import { TosPage } from "./terms_of_service";
import { PrivacyPage } from "./privacy_policy";

describe("legal views", () => {
  test("terms of service matches snapshot", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <TosPage />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
  test("privacy policy matches snapshot", () => {
    const tree = renderer
      .create(
        <MemoryRouter>
          <PrivacyPage />
        </MemoryRouter>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
