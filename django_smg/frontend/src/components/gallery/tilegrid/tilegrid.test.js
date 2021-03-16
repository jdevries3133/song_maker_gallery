import React from "react";
import renderer from "react-test-renderer";
import TileGrid from "./tilegrid";

import { apiResponse } from "../../../test/__mocks__/api_response";

test("snapshot", () => {
  const tree = renderer
    .create(<TileGrid data={apiResponse["songData"][0]} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
