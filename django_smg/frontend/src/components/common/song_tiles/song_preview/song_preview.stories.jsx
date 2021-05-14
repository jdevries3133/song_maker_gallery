import React from "react";

import { SongPreview } from "./song_preview";

const SONG = {
  name: "Josiah",
  songId: "6594803161104384",
  midi:
    "TVRoZAAAAAYAAQACA8BNVHJrAAAACwD/UQMHoSAA/y8ATVRyawAAAicAwQ0AkTB/AJFHf4NgkTJ/AIEwAACBRwAAkUV/g2CBMgAAgUUAAJE0fwCRQ3+DYJE1fwCBNAAAgUMAAJFBf4NggTUAAIFBAACRN38AkUB/g2CROX8AgTcAAIFAAACRPn+DYIE5AACBPgAAkTt/AJE8f4NgkTx/AIE7AACBPAAAkTt/g2CBPAAAgTsAAJE+fwCROX+DYJFAfwCBPgAAgTkAAJE3f4NggUAAAIE3AACRQX8AkTV/g2CRQ38AgUEAAIE1AACRNH+DYIFDAACBNAAAkUV/AJEyf4NgkUd/AIFFAACBMgAAkTB/g2CBRwAAgTAAAJFFfwCRMn+DYJFDfwCBRQAAgTIAAJE0f4NggUMAAIE0AACRQX8AkTV/g2CRQH8AgUEAAIE1AACRN3+DYIFAAACBNwAAkT5/AJE5f4NgkTx/AIE+AACBOQAAkTt/g2CBPAAAgTsAAJE7fwCRPH+DYJE5fwCBOwAAgTwAAJE+f4NggTkAAIE+AACRN38AkUB/g2CRNX8AgTcAAIFAAACRQX+DYIE1AACBQQAAkTR/AJFDf4NgkTJ/AIE0AACBQwAAkUV/g2CBMgAAgUUAAJEwfwCRR3+DYJEyfwCBMAAAgUcAAJFFf4NggTIAAIFFAACRNH8AkUN/g2CRNX8AgTQAAIFDAACRQX+DYIE1AACBQQAAkTd/AJFAf4NggTcAAIFAAACROX8AkT5/g2CBOQAAgT4AAP8vAA==",
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
};

export default {
  title: "Common/Song Tiles/Styled Preview",
  component: SongPreview,
};

const Template = (args) => <SongPreview {...args} />;

export const Default = Template.bind({});
Default.args = {
  song: SONG,
  width: 100,
  height: 100,
};

export const Stretched = Template.bind({});
Stretched.args = {
  song: SONG,
  width: 150,
  height: 100,
};

export const Squished = Template.bind({});
Squished.args = {
  song: SONG,
  width: 50,
  height: 100,
};
