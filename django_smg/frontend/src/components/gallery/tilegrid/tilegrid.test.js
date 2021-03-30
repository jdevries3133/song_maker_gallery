import React from "react";
import renderer from "react-test-renderer";
import "jest-styled-components";
import { TileGrid } from "./tilegrid";

import { apiResponse } from "Test/__mocks__/api_response";

test("snapshot", () => {
  const tree = renderer
    .create(<TileGrid data={apiResponse["songData"][0]} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
