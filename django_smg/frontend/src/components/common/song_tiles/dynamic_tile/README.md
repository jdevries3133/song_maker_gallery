# Dynamic Tile

This is the foundational module for generating svg from MIDI and JSON data
fetched from the Music Lab.

## `<DynamicTile />`

Tiles with hover effect as seen on the home page.

## `useSongRect`

Hook that takes a song object and returns an array of svg `<rect>` elements.
This is helpful to get at the underlying rects, for example displaing
a preview in a different context as is done in `<EventStream />`, where the
teacher user can see and overview of the events in their gallery.

This hook uses `useState` and `useEffect` under the hood to
