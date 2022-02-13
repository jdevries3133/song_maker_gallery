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
    // assign properties of song to 'this'
    Object.keys(this.song).forEach((i) => {
      this[i] = this.song[i];
    });
  }
  parse() {
    if (this.canParse()) {
      this.midiParsed = MidiParser.parse(this.song.midi);
      this.isParsed = true;
    }
  }
  canParse() {
    return !!this.song.midi;
  }
}
