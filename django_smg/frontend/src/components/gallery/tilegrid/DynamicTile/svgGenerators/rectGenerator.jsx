import React from "react";

import { PITCH_COLORS } from "../constants";

export class RectGenerator {
  /*
   * Generate rects to paint on the base SVG image
   *
   * THIS CLASS MAY GENERATE ERRORS if it encounters an unhandled midi event
   * type after calling the parse() method.
   *
   * There are many, many midi event types. I don't know if, in some
   * circumstances, the Music Lab Song Maker uses some event type that
   * actually matters for rendering the rects. Therefore, this class does
   * not fail silently!
   */
  constructor(song, gridContext) {
    this.song = song;
    this.gridContext = gridContext;
    this.rects = [];
    this.currentTime = 0;
    // evaluate number of tiles per octave
    let tilesPerOctave;
    switch (this.song.scale) {
      case "major":
      case "minior":
        tilesPerOctave = 7; // 1-based
        break;
      case "pentatonic":
        tilesPerOctave = 5; // 1-based
        break;
      case "chromatic":
        tilesPerOctave = 12; // 1-based
        break;
      default:
        throw new Error(`Unexpected scale type ${this.song.scale}`);
    }
    this.tilesPerOctave = tilesPerOctave;
  }

  generateRects() {
    this.generatePitchedTrackRects();
  }

  generatePitchedTrackRects() {
    const pitchedTrack = this.song.midiParsed.track[1];
    // forEach event
    pitchedTrack.event.forEach((msg) => {
      this.currentTime += msg.deltaTime;
      switch (msg.type) {
        /*
         * It's important to note that in the MusicLab Song Maker, all notes
         * are the same length: 1 subdivision, whatever that is. Therefore,
         * we can ignore all midi events except for type 9: "Note On."
         *
         * The purpose of the switch statement, then, is to catch midi event
         * types I don't expect and throw an error. There are many, many
         * types of midi events, and I don't want some unexpected events
         * to start creating bugs. Instead, it'll just throw an error so
         * I can see what's going on. Errors will be handled somewhere
         * higher up.
         */
        case 12:
          // program change; comes at start of each track
          break;
        case 8:
          // note off
          break;
        case 9:
          // note on
          this.noteNumber = msg.data[0];
          this.pushRect();
          break;
        case 255:
          // meta event
          switch (msg.metaType) {
            case 47:
              // end of track
              break;
            case 81:
              // SMTPE Offset (starting point offset from start of track
              break;
            default:
              throw new Error(`Unexpected meta event type ${msg.metaType}`);
          }
          break;
        default:
          throw new Error(`Unexpected event type ${msg.metaType}`);
      }
    });
  }

  evalScaleDegree(semitonesAboveRoot, scale) {
    /*
     * Returns scale degree (number) for n semitones above root.
     */
    let semitonesToScaleDegree;
    switch (scale) {
      case "major":
        semitonesToScaleDegree = {
          0: 1,
          2: 2,
          4: 3,
          5: 4,
          7: 5,
          9: 6,
          11: 7,
        };
        return semitonesToScaleDegree[semitonesAboveRoot];
      case "minor":
        semitonesToScaleDegree = {
          0: 1,
          2: 2,
          3: 3,
          5: 4,
          7: 5,
          8: 6,
          10: 7,
        };
        return semitonesToScaleDegree[semitonesAboveRoot];
      case "pentatonic":
        semitonesToScaleDegree = {
          0: 1,
          2: 2,
          4: 3,
          5: 4,
          9: 5,
        };
        return semitonesToScaleDegree[semitonesAboveRoot];
      case "chromatic":
        return semitonesAboveRoot + 1;
      default:
        throw new Error(`Unexpected scale "${scale}"`);
    }
  }

  calcX() {
    // calculate x position of the rectangle
    if (this.song.bars > 4) {
      /*
       * I actually experimented by turning this on. It actually works
       * like a charm! The only dilemma is that the song is condensed
       * down to the width of the tile, so it will just be a matter
       * of clipping the song off and showing only the beginning so
       * it doesn't look too condensed.
       */
      throw new Error(`
        Songs longer than 5 bars have a horizontal slider, which has not yet
        been handled
      `);
    }
    return (
      (this.currentTime / this.song.midiParsed.timeDivision) *
      (this.gridContext.pixelWidth / (this.song.bars * this.song.beats))
    );
  }
  calcY() {
    /*
     *  Calculate y position of the rectangle.
     *
     *  This function uses a couple magic numbers that aren't significant
     *  enough to move to the constants file:
     *
     *  48
     *  No matter the setting, the lowest note in the song maker is C3 or above.
     *  The midi number for C3 is 48. Therefore, octaveIndex is calculating
     *  a 0-based index for which octave the note is in.
     *
     *  12
     *  Number of semitones in an octave.
     */
    if (this.song.scale === "chromatic" && this.song.octaves > 2) {
      throw new Error(`
        Three octave chromatic scale songs have a vertical slider, which has
        not yet been handled.
      `);
    }
    // figure out how many tiles up from the bottom the current note is
    const semitonesAboveRoot =
      (this.noteNumber % 12) - (this.song.rootNote % 12);
    const scaleDegree = this.evalScaleDegree(
      semitonesAboveRoot,
      this.song.scale
    );
    const octaveIndex = Math.floor((this.noteNumber - 48) / 12);
    const tilesFromBottom = scaleDegree + octaveIndex * this.tilesPerOctave;

    // now that we know tilesFromBottom, the return value is a simple
    // function:
    return (
      this.gridContext.pixelHeight -
      tilesFromBottom *
        (this.gridContext.pixelHeight /
          (this.tilesPerOctave * this.song.octaves))
    );
  }
  calcColor() {
    return PITCH_COLORS[this.noteNumber % 12];
  }
  calcWidth() {
    return (
      this.gridContext.pixelWidth /
      (this.song.bars * this.song.beats * this.song.subdivision)
    );
  }
  calcHeight() {
    return (
      this.gridContext.pixelHeight / (this.tilesPerOctave * this.song.octaves)
    );
  }

  pushRect() {
    this.rects.push(
      <rect
        key={this.currentTime + Math.random().toString()}
        width={this.calcWidth()}
        height={this.calcHeight()}
        x={this.calcX() + "px"}
        y={this.calcY() + "px"}
        style={{ fill: this.calcColor() }}
      />
    );
  }
}
