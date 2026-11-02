# bloom;

## structure

```
src/pages/index.astro          the story site (Sam's evening and morning with Bloom)
src/pages/prototype.astro      the journal click-through demo
src/layouts/Base.astro         the document, fonts, and stylesheet
src/layouts/Site.astro         the story site shell, plus the scroll-reveal script
src/styles/site.css            story site styles: phone, pill, sheet, reveal
src/data/site.ts               every word on the story site, in order
src/styles/global.css          tokens and every screen’s layout
src/data/story.ts              titles, copy, days, imported events, loose ends
src/journal/model.ts           screen math: parked count, card heights, fresh state
src/journal/useJournal.ts      screen state, swipe between home and week, drag and undo

src/components/chrome/PhoneStage.tsx    centres the phone and the restart button
src/components/chrome/MobileFrame.tsx   the phone and the glass card behind it
src/components/chrome/StatusBar.tsx     time and signal, wi-fi, battery
src/components/chrome/RestartButton.tsx puts the demo back on Home

src/components/journal/JournalPage.tsx  wires the phone, status bar, and journal together
src/components/journal/JournalApp.tsx   the four screens, the delete pill, and the undo toast
src/components/journal/HomeScreen.tsx   title, settings, notes, record button, calendar edge
src/components/journal/Blob.tsx         one home note
src/components/journal/GlassMic.tsx     the record button (it only pulses)
src/components/journal/NoteScreen.tsx   the open voice note
src/components/journal/Player.tsx       play control and waveform
src/components/journal/WeekScreen.tsx   the week columns and the parked tray
src/components/journal/DayScreen.tsx    Friday’s timeline
src/components/journal/CalendarItem.tsx one imported, suggested, or placed event
src/components/journal/SourceTag.tsx    Google Calendar or Notion mark
src/components/journal/LooseEndChip.tsx one row in the parked tray

src/components/site/            story site parts: StoryLine, BigLine, PhonePlaceholder,
                                MediaPlaceholder, FeaturePill (opens a sheet), Divider, Logo, Brand

public/assets/                  note fields, status icons, and control icons
```

`story.ts` is the place for copy. Note colors are `rose`, `apricot`, and `sky`. Imported events use `sky` (Google Calendar) and `cream` (Notion). A loose end’s `clock` is the label beside it on Friday; `time` is the range inside the card.

The phone’s radius, border, and shadow, and the glass card behind it, live in `MobileFrame.tsx`.


## story site

Each phone on `/` is a placeholder. To drop in a screen recording, add the file to `public/assets/` and set `src` on that block in `src/data/site.ts` (`.gif`, `.png`, `.mp4` or `.webm`). The lamp photo and the closing film work the same way.
