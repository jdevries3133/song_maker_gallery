# Welcome to the Music Lab Song Maker Gallery!

## Overview

This website was created by me, a music teacher, in response to the need to
find a simple way to feature our students' work in light of the COVID-19
pandemic. Our students' concerts have been canceled, their rehearsals ceased,
and their opportunities to share music diminished to a whisper of what they
once were.

As an elementary general music teacher, a big part of my COVID curriculum has
been the [Chrome Music Lab.](http://musiclab.chromeexperiments.com/)
Students love making creations with it. It's fun and easy to use, and it
provides an amazing platform for us to discuss the topics in our music
curriculum. For me, the music lab has been an indispensable tool for coping
with our school closure, and this project has opened up new doors for how
myself and hundreds of other music educators make use of the Music Lab.

## How it Works

The teacher posts links from
[Google's Music Lab Song Maker](http://musiclab.chromeexperiments.com/Song-Maker/).
This site captures student work by fetching and caching midi and json data
from google's api. The frontend then uses that data to display beautiful,
dynamically rendered thumbnails of students' work.

## Feature Request?

Do you have an idea for a killer new feature? Open an issue in the "issues" tab
and let me know! If you want to add a new user-facing feature, I'm happy to
support that effort by providing guidance through the codebase, reviewing code,
and assisting with deploying new changes.

## New in Version 3

### Overview

Version 2 of the site was the first production deployment that others came to
know and love. Despite being scrappy and endearing, there was much left to be
desired towards in terms of UX. In version 2, teachers had to upload
spreadsheets to create galleries, which is a cumbersome and technically
unnecessary process. The codebase needed a bit of love towards refactoring the
teacher UI, improving unit test coverage, and adding automated integration
tests. Finally, many new features had to be implemented on the frontend and
backend to faciltate the main new user-facing feature: **Automated Galleries
include the ability to create automated galleries with student-uploaded
content.**

### Created User Stories with Storybook UI

Components were developed with Storybook UI.

### Designed and Implemented Frontend Components

Created new frontend features, from
[wireframes](https://user-images.githubusercontent.com/58614260/112180266-c6859100-8bd1-11eb-9fda-9056fdd96acf.png)
to production.

### API is now truly RESTful

Truthfully, I didn't know what that meant when I started this project in Spring
2020\. I learned, though! And, refactoring the API to be RESTful allows machine
users (i.e. the frontend) to interact with different levels of gallery-related
entities: `Song`, `SongGroup`, and `Gallery`.

### Codebase Improvements

Technical debt was paid in order to be able to move forward on the fun stuff.

| item              | v2  | v3  |
| ----------------- | --- | --- |
| unit tests        | 72  | 122 |
| integration tests | 0   | 8   |
| storybook stories | 0   | 38  |

## Contributing

See
[our contributing guide](https://github.com/jdevries3133/song_maker_gallery/blob/main/CONTRIBUTING.md)
for details. Contributors are welcome! The project is available under the MIT
license.
