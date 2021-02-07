# Post This on Social Media!

> Help the site grow. Music teachers trust music teachers, and you're probably
> here because you think this is an awesome project and want to know more!

Hi all! I am really excited to share this awesome quarentine project / hopefully helpful
website made by a music teacher!

Here it is! [https://songmakergallery.com/](https://songmakergallery.com/)

This website is an extension of the popular and much-beloved Google Chrome
Music Lab. I personally love using the music lab in a wide variety of ways in
my own lessons, but at the end of the day all you are left to show for
students' creative output is a spreadsheet full of URLs. With the song
maker gallery, you can upload the links to your students' work and the website
will automatically create a beautiful, interactive, and ad-free online gallery
where you can share your students compositions with their peers and your school
community!

Best of all, this project is 100% free to use and open source. Feel free to
check it out on github if you are interested in contributing, or just want
to suggest a new feature
([https://github.com/jdevries3133/song_maker_gallery](https://github.com/jdevries3133/song_maker_gallery)).

> Feel free to attach this image too!

<img src="https://songmakergallery.com/static/frontend/media/site_screenshot.png" />

# Welcome to the Music Lab Song Maker Gallery!

### Feature Request?

Do you have an idea for a killer new feature? Open an issue in the "issues"
tab and let me know! As you will see, there are already a few feature
ideas on the roadmap.

### Overview

This website was created by me, a music teacher, in response to the simple
need to find a way to feature our students' work in light of the COVID-19
pandemic. Our students' concerts have been cancelled, their rehearsals ceased,
and their opportunities to share music diminished to a whisper of what they
once were.

As a third, fourth, and fifth grade elementary general music teacher, a big
part of my COVID curriculum has been the Chrome Music Lab. Students love
making creations with it; it's fun and easy to use, and it provides an
amazing platform for us to discuss the topics in our music curriculum. For me,
the music lab has been an indispensable tool for coping with our school
closure.

This website is a simple way to share your students' work with your whole
community. I know that I have been awestruck by the creativity of many of the
music lab compositions that my students have shared with me, and I am sure
that you feel the same.

### How it Works

The teacher posts links from
[this website](http://musiclab.chromeexperiments.com/Song-Maker/).
The site captures student work by fetching midi and json data from google's
api. The frontend then uses that data to display beautiful, dynamically
rendered thumbnails of students' work.

### Roadmap

These are some major new features I'm interested in implementing.

**Submission Links**

One of the pain points of using this site is that the teacher has to gather
many links, and has to upload one spreadsheet for each group. I would like to
make a submission link available to the teacher that they can share with their
students. Students can submit their song links themselves, saving the teacher
the work of gathering their students' work.

See
[#10](https://github.com/jdevries3133/song_maker_gallery/issues/10)
if you are interested!

**Student Response**

"Responding," is a key tenent of music curricula. I would like to create an
environment where students can respond to and critique each other's work
while also being monitored by the teacher.

See
[#11](https://github.com/jdevries3133/song_maker_gallery/issues/11)
if you are interested!

**SEO**

Making the homepage static and generally making the site look to search
engines like the dynamic site it is will drastically improve search engine
optimization.

**Blog**

A blog that helps explain specific ways to use the site would be useful
to teachers. I'd be happy to maintain a blog if it existed, but first someone
would need to implement a blog into the project. Probably easy to do with
Django.
