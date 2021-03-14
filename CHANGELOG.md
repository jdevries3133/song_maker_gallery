# 2.1.1

- Fix spreadsheet parsing bugs on the backend, mostly related to handling
  names with extra whitespace.
- Issue #21: Better error messages for invalid spreadsheets. The site will now
  provide a detailed "traceback" identifying each error and which row the
  error occured on.
  - missing name or link values
  - invalid links
- Validate group name length to enforce 15 character limit. Update CSS to
  make group names always display nicely.
- Scripts for develoment and dev ops
  - Automated database backup
  - Automated construction and destruction of mysql database through Docker
    for easy testing
- Misc bug fixes (#23, #15, #26)
