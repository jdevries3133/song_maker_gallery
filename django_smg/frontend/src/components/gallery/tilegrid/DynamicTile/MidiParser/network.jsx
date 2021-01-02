// In the final implementation, this file will make the network requests
// back to my server to fetch midi files and json objets, which will need
// to be cached in my database because of google's CORS policy.

// For now, the midi file and json are loaded directly.

import axios from "axios";
import { MIDI_ENDPOINT, JSON_ENDPOINT } from "../constants";

async function fetchMidi(songId) {
  const endpoint = MIDI_ENDPOINT + songId;
  return axios
    .get(endpoint, {
      responseType: "arraybuffer",
    })
    .catch(() => console.error(`Midi data for songId ${songId} not found`));
}

async function fetchJson(songId) {
  return axios
    .get(JSON_ENDPOINT + songId)
    .catch(() => console.error(`Json object for songId ${songId} not found`));
}

export async function getSongData(songId) {
  const midiPromise = fetchMidi(songId);
  const jsonPromise = fetchJson(songId);
  // will need to fix later; web requests will block main thread
  let returnData;
  await Promise.all([midiPromise, jsonPromise])
    .then(([midi, json]) => {
      returnData = {
        midiBytes: btoa(
          String.fromCharCode.apply(null, new Uint8Array(midi.data))
        ),
        json: json.data,
      };
    })
    .catch(() => {
      console.warn(
        "<DynamicTile>: Network error fetching song data. Is the backend properly configured?"
      );
    });
  return returnData;
}
