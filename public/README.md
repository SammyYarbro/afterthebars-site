# After the Bars Video Library

This is a custom static website prototype for the After the Bars channel.

## Included
- Dark neon / courtroom-inspired After the Bars visual identity
- Dedicated case collection cards
- Karen Read collection
- Karmelo Anthony collection
- Recovery section
- Faith section
- Personal Story section
- Interview category
- Search and filtering
- Responsive mobile design
- Custom-branded modal video player shell
- Custom play/pause, 10-second rewind/forward, mute and fullscreen controls
- YouTube iframe integration

## Important: Add your real videos
Open `app.js` and edit the `videos` array.

Replace:
`youtubeId: "M7lc1UVf-VE"`

with the video ID from your own YouTube URL.

Example:
https://www.youtube.com/watch?v=ABC123XYZ

Use:
`youtubeId: "ABC123XYZ"`

You can add unlimited videos by copying one object in the array and changing:
- title
- category
- series
- collection
- duration
- date
- youtubeId
- description

## Categories recognized
- case
- recovery
- faith
- story
- interview

## Run it
Open `index.html` in a browser.

For the YouTube API and Google font to work reliably, use a tiny local web server such as:
`python -m http.server 8000`

Then open:
`http://localhost:8000`

## Next-level upgrades
This prototype can later be connected to:
- YouTube Data API for automatic uploads/playlists
- Supabase or Firebase
- A CMS/admin page
- Membership/login
- Featured-video scheduling
- Video transcripts
- Search by person/case/date
- Dedicated `/cases/karen-read` style pages
- Podcast audio section
