import React from "react";

import { EventStream } from "./event_stream";

const SAMPLE_SONG = {
  name: "Jamie",
  songId: "5868376585404416",
  midiBytes:
    "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",
  metadata: {
    bars: 13,
    beats: 4,
    instrument: "synth",
    octaves: 2,
    percussion: "electronic",
    percussionNotes: 2,
    rootNote: 48,
    rootOctave: 4,
    rootPitch: 0,
    scale: "major",
    subdivision: 2,
    tempo: 240,
  },
};

export default {
  title: "Teacher/Event Stream",
};

const Template = (args) => <EventStream {...args} />;

export const Default = Template.bind({});
Default.args = {
  events: [
    {
      type: "like",
      username: "Janice",
      value: null,
      isApproved: true,
      song: SAMPLE_SONG,
    },
    {
      type: "heart",
      username: "James",
      value: null,
      isApproved: true,
      song: SAMPLE_SONG,
    },
    {
      type: "star",
      username: "Asaun",
      value: null,
      isApproved: true,
      song: SAMPLE_SONG,
    },
    {
      type: "comment",
      username: "Mike",
      value: "Wohoo! 😁 😁",
      isApproved: true,
      song: SAMPLE_SONG,
    },
    {
      type: "heart",
      username: "Janice",
      value: "Nice song, Jamie!",
      isApproved: true,
      song: SAMPLE_SONG,
    },
    {
      type: "comment",
      username: "Amir",
      value: "Good stuff my guy",
      isApproved: false,
      song: SAMPLE_SONG,
    },
  ],
};
