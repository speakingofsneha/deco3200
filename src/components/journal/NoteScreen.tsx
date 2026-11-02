// the open voice note. bloom doesn't reply; its synthesis shows
// the feelings in what was said, the themes, and the loose ends.
import { url } from "../../lib/path";
import type { CSSProperties } from "react";
import { calColors, story, type OrbColor } from "../../data/story";
import type { JournalActions, JournalState } from "../../journal/useJournal";
import FeelingOrbs from "./FeelingOrbs";
import Player from "./Player";
import Sheet from "./Sheet";

interface Props {
  state: JournalState;
  actions: JournalActions;
}

export function feelingColor(color: OrbColor): CSSProperties {
  return { "--feel": `var(--color-${color})` } as CSSProperties;
}

export default function NoteScreen({ state, actions }: Props) {
  const r = story.note.synthesis;
  const { tab } = state;
  const parked = story.looseEnds.filter((item) => item.noteId === story.note.id);

  return (
    <Sheet id="screen-note" labelledBy="note-title" open={state.screen === "note"} origin={state.origin} pull={state.pull}>
      <header className="screen-head">
        <button type="button" className="back-btn" id="note-back" aria-label={story.ui.backHome} onClick={actions.close}>
          <img src={url("/assets/back.svg")} width={18} height={18} alt="" />
        </button>
        <h1 id="note-title" tabIndex={-1}>
          {story.note.title}
        </h1>
      </header>
      <div className="note-scroll" id="note-scroll">
        <Player
          duration={story.note.duration}
          playing={state.playing}
          playLabel={story.ui.play}
          pauseLabel={story.ui.pause}
          onToggle={actions.togglePlay}
        />
        <p className="throughline">{story.note.throughline}</p>
        <div className="tabs">
          <div className="tablist" role="tablist" aria-label={story.ui.tablist}>
            {story.note.tabs.map((item) => {
              const selected = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  id={`tab-${item.id}`}
                  data-tab={item.id}
                  aria-controls={`panel-${item.id}`}
                  aria-selected={selected}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => actions.selectTab(item.id)}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div role="tabpanel" className="tab-panel" id="panel-synthesis" aria-labelledby="tab-synthesis" tabIndex={0} hidden={tab !== "synthesis"}>
            <section className="refl">
              <h2 className="eyebrow">{r.feelingsLabel}</h2>
              <FeelingOrbs feelings={r.feelings} />
            </section>

            <section className="refl">
              <h2 className="eyebrow">{r.themesLabel}</h2>
              <ul className="theme-lines">
                {r.themes.map((t) => (
                  <li key={t}>
                    <span className="spark" aria-hidden="true">
                      ✦
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
            </section>

            <section className="refl">
              <h2 className="eyebrow">{r.parkedLabel}</h2>
              <ul className="parked-list">
                {parked.map((item) => (
                  <li key={item.id}>
                    <span className="cal-dot" style={{ background: calColors[item.color].hex }} aria-hidden="true" />
                    <span className="parked-title">{item.title}</span>
                    <span className="parked-cat">{item.category}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <div role="tabpanel" className="tab-panel" id="panel-transcript" aria-labelledby="tab-transcript" tabIndex={0} hidden={tab !== "transcript"}>
            <p className="prose transcript">{story.note.transcript}</p>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
