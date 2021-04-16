import React from "react";

import { EventStream } from "./event_stream";

export default {
  title: "Teacher/Event Stream",
};

const SAMPLE_SONG = {
  name: "Josiah",
  songId: "6594803161104384",
  midiBytes:
    "TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAicAwQ0AkTB/AJFHf4NgkTJ/AIEwAACBRwAAkUV/g2CBMgAAgUUAAJE0fwCRQ3+DYJE1fwCBNAAAgUMAAJFBf4NggTUAAIFBAACRN38AkUB/g2CROX8AgTcAAIFAAACRPn+DYIE5AACBPgAAkTt/AJE8f4NgkTx/AIE7AACBPAAAkTt/g2CBPAAAgTsAAJE+fwCROX+DYJFAfwCBPgAAgTkAAJE3f4NggUAAAIE3AACRQX8AkTV/g2CRQ38AgUEAAIE1AACRNH+DYIFDAACBNAAAkUV/AJEyf4NgkUd/AIFFAACBMgAAkTB/g2CBRwAAgTAAAJFFfwCRMn+DYJFDfwCBRQAAgTIAAJE0f4NggUMAAIE0AACRQX8AkTV/g2CRQH8AgUEAAIE1AACRN3+DYIFAAACBNwAAkT5/AJE5f4NgkTx/AIE+AACBOQAAkTt/g2CBPAAAgTsAAJE7fwCRPH+DYJE5fwCBOwAAgTwAAJE+f4NggTkAAIE+AACRN38AkUB/g2CRNX8AgTcAAIFAAACRQX+DYIE1AACBQQAAkTR/AJFDf4NgkTJ/AIE0AACBQwAAkUV/g2CBMgAAgUUAAJEwfwCRR3+DYJEyfwCBMAAAgUcAAJFFf4NggTIAAIFFAACRNH8AkUN/g2CRNX8AgTQAAIFDAACRQX+DYIE1AACBQQAAkTd/AJFAf4NggTcAAIFAAACROX8AkT5/g2CBOQAAgT4AAP8vAA==",
  metadata: {
    bars: 4,
    beats: 4,
    nstrument: "marimba",
    octaves: 2,
    percussion: "electronic",
    percussionNotes: 2,
    rootNote: 48,
    rootOctave: 4,
    rootPitch: 0,
    scale: "major",
    subdivision: 2,
    tempo: 120,
  },
};

const Template = (args) => <EventStream {...args} />;

export const Default = Template.bind({});
Default.args = {
  fetchMoreEvents: () => console.log("getting more events"),
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
      isApproved: false,
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
      username: "Shawn",
      value:
        "That is all fine and good, but did you think about what would happen if you ended up with a really, really long comment in here?",
      isApproved: false,
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
