import MidiParser from "midi-parser-js";

export class Song {
  /*
   * Song.parse() will return 1 if there is an error. That can include a
   * network error fetching the song data from the backend. After calling
   * the parse() method, always check that Song.isParsed is true before
   * moving on.
   */
  constructor(song) {
    this.song = song;
    this.isParsed = false;
    Object.keys(this.song.metadata).forEach((i) => {
      this[i] = this.song.metadata[i];
    });
  }
  parse() {
    this.midiParsed = MidiParser.parse(this.song.midiBytes);
    this.isParsed = true;
  }
}
