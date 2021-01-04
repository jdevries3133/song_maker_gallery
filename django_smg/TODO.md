- [x] Create GalleryDatasetSerializer.render_many method
- [x] Create user galleries list view
- [x] Create public rendered gallery view
- [x] Update frontend actions to use new api views
- [x] Update frontend state management to expect songData
- [x] Make backend gallery delete endpoint
- [x] Fetching and caching service
- [ ] ~~Hook sample gallery into django migration~~ _did below instead_
- [x] Include hard coded sample gallery in the frontend
- [x] `/api/auth/login` rotates token upon authenticated GET request.
- [x] Fix `/api/gallery/undefined` bug.
- [x] Fix post-delete gallery dialogue box is not dismissed
- [x] Update "mobile optimized view" for Teacher component
- [x] Fix group name not set properly by frontend
  - Should be the last row in the group.
- [x] Integrate dynamic tile
  - See `frontend/src/components/gallery/tilegrid/tile.jsx` for a detailed
    TODO list on dynamic tile integration.
- [x] Create API service to provide songData to frontend
- [ ] Make text beneath "add a gallery" clearer.
- [x] Fix phantom "gallery deleted" dialogue bug in teacher component.
- [ ] Provide a template spreadsheet
- [x] Fix bug where it is impossible to scroll to bottom of gallery in mobile.
  - This was related to the old mobile tile component
  - May come back if any of that code is used again
- [x] After csv upload, remove ".csv" from initial group name assignment
  - In `frontend/src/components/teacher/teacher.jsx`
  - After a csv file is initially uploaded
  - Group name initial value is the name of the csv file, including ".csv".
  - To fix: Remove ".csv" from the initial name of the group
- [ ] **major bug**: galleries with multiple groups not rendering as expected.
  - All group names are bunched in single lists at the very end
  - It is most likely a significant mistake in the serializer not adequately
    covered by test cases
- [x] Tiles don't appear to be resizing in response to `pixelWidth` or
      `pixelHeight` props

### Low-Priority

- [ ] Allow login via username _or_ email
