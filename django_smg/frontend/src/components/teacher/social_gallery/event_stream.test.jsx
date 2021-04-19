import React from "react";
import renderer from "react-test-renderer";

import { EVENTS } from "./__mocks__/data.js";
import { EventStream } from "./event_stream";

it("matches snapshot", () => {
  expect(
    renderer.create(<EventStream events={EVENTS} />).toJSON()
  ).toMatchSnapshot();
});
