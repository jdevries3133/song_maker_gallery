import React from "react";

import { Card } from "./index";
import { Button } from "Styles";

export default {
  title: "Card",
  component: Card,
};

const Template = (args) => <Card {...args} />;

export const Default = Template.bind({});
Default.args = {
  title: "Custom Gallery",
  description: "Make your students' compositions shine",
  media: "monitor_students_md.jpg",
  ActionButton: <Button>Action Now!</Button>,
};

// TODO: make this one look good too (fix box-shadow hover bug due to overflow)
export const ExtraActionContent = Template.bind({});
ExtraActionContent.args = {
  title: "This one has a bit longer of a title!",
  description:
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem " +
    "accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae " +
    "abillo inventore veritatis et quasi architecto beatae vitae dicta sunt " +
    "explicabo.",
  media: "student_submit_md.jpg",
  ActionButton: (
    <>
      <p>I want to pass a bit of additional information!</p>
      <p>
        Let me know <a href="#">what you think!</a>
      </p>
      <Button>Click me please!</Button>
    </>
  ),
};
