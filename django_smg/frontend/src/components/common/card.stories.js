import React from "react";

import { Card } from "./card";
import { P, Button } from "Styles";

export default {
  title: "Card",
  component: Card,
};

const Template = (args) => (
  <Card {...args}>
    <>
      <P>Test content of a card.</P>
      <P>What do you think?</P>
      <Button>Action!</Button>
    </>
  </Card>
);

export const Default = Template.bind({});

Default.args = {
  title: "Custom Gallery",
  description: "Make your students' compositions shine",
  media: "monitor_students_md.jpg",
};
