import React from "react";
import { StagedGroup } from "./staged_group";

// used by every mock student here
const LINK =
  "https://musiclab.chromeexperiments.com/Song-Maker/song/5635608291049472";
const SAMPLE_GROUP = [
  ["John A.", LINK],
  ["Sally Gregson", LINK],
  ["Mike", LINK],
  "Group 1",
];

export default {
  title: "teacher/Staged Group",
  component: StagedGroup,
};

const Template = (args) => <StagedGroup {...args} />;

export const SampleGroup = Template.bind({});
SampleGroup.args = {
  group: SAMPLE_GROUP,
  unstageGroupHandler: () => null,
};
