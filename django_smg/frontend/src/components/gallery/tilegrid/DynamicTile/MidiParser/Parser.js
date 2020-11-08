import MidiParser from "midi-parser-js";
import { getSongData } from "./network";

export class Song {
  /*
   * Song.parse() will return 1 if there is an error. That can include a
   * network error fetching the song data from the backend. After calling
   * the parse() method, always check that Song.isParsed is true before
   * moving on.
   */
  constructor(songId) {
    this.songId = songId;
    this.isParsed = false;
  }
  async parse() {
    await getSongData(this.songId)
      .then((data) => {
        this._songData = data;
        this.parseFetchedData();
        this.assignJsonAsAttrs();
        this.isParsed = true;
      })
      .catch((e) => {
        return 1;
      });
  }
  parseFetchedData() {
    this.midiParsed = MidiParser.parse(this._songData.midiBytes);
  }
  assignJsonAsAttrs() {
    // lifts the attributes in the json file to class attributes
    Object.keys(this._songData.json).forEach((i) => {
      this[i] = this._songData.json[i];
    });
  }
}
