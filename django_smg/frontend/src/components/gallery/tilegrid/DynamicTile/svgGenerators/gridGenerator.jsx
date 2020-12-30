import React from "react";

export class GridGenerator {
  constructor(song, gridContext) {
    this.song = song;
    this.gridContext = gridContext;
    this.grid = [];
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
  generateGrid() {
    // TODO: generate grid
    this.generateHorizontalLines();
    this.generateVerticalLines();
    this.generateShadedAreas();
  }
  generateHorizontalLines() {
    /*
     * Generate all vertical lines; thin lines after each note of the scale,
     * and thick notes at the octave.
     */
  }
  generateVerticalLines() {
    /*
     * Generate all vertical lines; thicker lines for beats, and thinner
     * lines for subdivisions
     */
  }
  generateShadedAreas() {
    /*
     * Shade in every other measure
     */
  }
}
