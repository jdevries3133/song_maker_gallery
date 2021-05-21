import React from "react";
import { Context as C } from "Common/storybook_util";
import { ListGalleries } from "./index";

export default {
  title: "teacher/List Galleries",
  component: ListGalleries,
};

const Template = (args) => (
  <C>
    <ListGalleries {...args} />
  </C>
);

export const Default = Template.bind({});
Default.args = {
  acknowledgeDelete: () => {},
  getUserGalleries: () => {},
  deleteStatus: "",
  deleteGallery: () => {},
  token: "test token",
  galleries: [
    {
      title: "Gallery 1",
      description: "This is the description for gallery 1",
      slug: "gallery-1",
      pk: 1,
    },
    {
      title: "Gallery 2 Has a Long Title",
      description: "Th1s is the description for gallery 2",
      slug: "gallery-2",
      pk: 2,
    },
    {
      title: "Gallery 1",
      description: "This is the description for gallery 1",
      slug: "gallery-1",
      pk: 1,
    },
    {
      title: "Gallery 2 Has a Long Title",
      description: "Th1s is the description for gallery 2",
      slug: "gallery-2",
      pk: 2,
    },
    {
      title: "Gallery 1",
      description: "This is the description for gallery 1",
      slug: "gallery-1",
      pk: 1,
    },
    {
      title: "Gallery 2 Has a Long Title",
      description: "Th1s is the description for gallery 2",
      slug: "gallery-2",
      pk: 2,
    },
  ],
};
