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
- [ ] Integrate dynamic tile
  - See `frontend/src/components/gallery/tilegrid/tile.jsx` for a detailed
    TODO list on dynamic tile integration.
- [ ] Create API service to provide songData to frontend
- [ ] Make text beneath "add a gallery" clearer.
- [ ] Provide a template spreadsheet
- [ ] Fix bug where it is impossible to scroll to bottom of gallery in mobile.

### Low-Priority

- [ ] Make it so the donation button automatically doesn't appear for the
      galleries of privileged users.
- [ ] Allow login via username _or_ email
