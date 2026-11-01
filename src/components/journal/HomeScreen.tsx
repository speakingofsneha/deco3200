// home. blobs are notes. the right edge opens the week.
import { blobLabel, story } from "../../data/story";
import { meetingsDots, type Items } from "../../journal/model";
import type { JournalActions } from "../../journal/useJournal";
import Blob from "./Blob";
import GlassMic from "./GlassMic";

interface Props {
  items: Items;
  active: boolean;
  pulse: number;
  actions: JournalActions;
}

export default function HomeScreen({ items, active, pulse, actions }: Props) {
  return (
    <section className="pane home" id="screen-home" aria-labelledby="home-title" inert={!active}>
      <header className="home-head">
        <h1 id="home-title" tabIndex={-1}>
          {story.home.title}
        </h1>
      </header>
      <button type="button" className="settings" aria-label={story.ui.settings}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
      <div className="blob-field">
        {story.home.notes.map((note) => {
          const dots = note.id === "meetings" ? meetingsDots(items) : note.dots;
          return (
            <Blob
              key={note.id}
              id={note.id}
              label={note.label}
              color={note.color}
              dots={dots}
              opens={note.opens}
              ariaLabel={blobLabel(note.label, dots)}
              onOpen={actions.openNote}
            />
          );
        })}
      </div>
      <GlassMic label={story.ui.mic} pulse={pulse} onPulse={actions.pulseMic} />
      <button type="button" className="edge-tab edge-tab--right" aria-label={story.ui.openCalendar} onClick={actions.openWeek}>
        <span className="tab-visual" aria-hidden="true">
          {"<"}
        </span>
      </button>
    </section>
  );
}
