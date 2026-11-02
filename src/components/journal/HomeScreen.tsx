// home. orbs are notes. swipe left, or use the right edge, to reach the week.
import { blobLabel, orbScale, story } from "../../data/story";
import { meetingsDots, type Items } from "../../journal/model";
import type { JournalActions } from "../../journal/useJournal";
import Blob from "./Blob";
import GlassMic from "./GlassMic";

interface Props {
  items: Items;
  active: boolean;
  recorded: boolean;
  arrived: boolean;
  actions: JournalActions;
}

export default function HomeScreen({ items, active, recorded, arrived, actions }: Props) {
  const notes = story.home.notes.filter((note) => !note.recorded || recorded);

  return (
    <section className="pane home" id="screen-home" aria-labelledby="home-title" inert={!active}>
      <header className="home-head">
        <h1 id="home-title" tabIndex={-1}>
          {story.home.title}
        </h1>
        <button type="button" className="patterns-pill" onClick={(event) => actions.openPatterns(event.currentTarget)}>
          <span className="spark" aria-hidden="true">
            ✦
          </span>
          {story.home.patterns}
        </button>
      </header>
      <button type="button" className="settings" aria-label={story.ui.settings} onClick={(event) => actions.openSettings(event.currentTarget)}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>

      <div className="blob-field">
        {notes.map((note, index) => {
          const dots = note.recorded ? meetingsDots(items) : 0;
          return (
            <Blob
              key={note.id}
              id={note.id}
              index={index}
              label={note.label}
              meta={note.meta}
              minutes={note.minutes}
              colors={note.colors}
              dots={dots}
              opens={Boolean(note.recorded)}
              arriving={Boolean(note.recorded && arrived)}
              ariaLabel={blobLabel(note.label, dots)}
              onOpen={actions.openNote}
            />
          );
        })}
      </div>

      <p className={arrived ? "arrival is-on" : "arrival"} role="status" aria-live="polite">
        {arrived ? story.home.arrived : ""}
      </p>

      <GlassMic label={story.ui.mic} hint={recorded ? null : story.home.hint} onTap={actions.openRecording} />

      <button type="button" className="edge-tab edge-tab--right" aria-label={story.ui.openCalendar} onClick={actions.openWeek}>
        <span className="tab-visual" aria-hidden="true">
          <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
            <path d="M6.5 1 1.5 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
    </section>
  );
}
