- [x] Create GalleryDatasetSerializer.render_many method
- [x] Create user galleries list view
- [x] Create public rendered gallery view
- [x] Update frontend actions to use new api views
- [x] Update frontend state management to expect songData
- [x] Make backend gallery delete endpoint
- [x] Fetching and caching service
- [x] Include hard coded sample gallery in the frontend
- [x] `/api/auth/login` rotates token upon authenticated GET request.
- [x] Fix `/api/gallery/undefined` bug.
- [x] Fix post-delete gallery dialogue box is not dismissed
- [x] Update "mobile optimized view" for Teacher component
- [x] Fix group name not set properly by frontend
- [x] Integrate dynamic tile
- [x] Create API service to provide songData to frontend
- [x] Fix phantom "gallery deleted" dialogue bug in teacher component.
- [x] Fix bug where it is impossible to scroll to bottom of gallery in mobile.
- [x] After csv upload, remove ".csv" from initial group name assignment
- [x] galleries with multiple groups not rendering as expected.
- [x] Tiles don't appear to be resizing in response to `pixelWidth` or
      `pixelHeight` props
- [x] Make text beneath "add a gallery" clearer.
- [x] Provide a template spreadsheet
- [x] Style tile component
  - [x] Restore **hover** animations to tile component
- [x] Remove depricated tile component code from old integration
- [x] Fix slow loading time after galley creation
  - After gallery creation, the gallery is rendered and returned. This is
    slow because forcing a render makes the backend reach out to the google API
    unnecessarily.
  - Either:
    - Do not force a render after gallery creation
    - Give the user a loading spinner showing that the backend is working
      and everything will be ok
- [x] Optimize extremely slow re-rendering in gallery on screen size change
      by only re-rendering the component if the width crosses the threshold.
- [x] update terms of use and privacy policy
- [x] Make site-wide footer with terms of use and privacy policy except on
  - gallery page
- [x] Allow login via username _or_ email; thanks João!
- [x] Frontend must provide descriptive response to user for duplicate email
- [ ] Create student link submission view as a premium feature.
- [x] Add sitemap.xml and robots.txt
