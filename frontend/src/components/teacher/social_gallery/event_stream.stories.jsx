import React from "react";

import { EVENTS } from "./__mocks__/data.js";
import { EventStream } from "./event_stream";

export default {
  title: "Teacher/Event Stream",
};

const Template = (args) => <EventStream {...args} />;

export const Default = Template.bind({});
Default.args = {
  fetchMoreEvents: () => console.log("getting more events"),
  events: EVENTS,
};
