// the open voice note. bloom doesn't reply; it reflects:
// the feelings in what was said, its themes, threads and loose ends.
import type { CSSProperties } from "react";
import { calColors, story, type OrbColor } from "../../data/story";
import type { JournalActions, JournalState } from "../../journal/useJournal";
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
  const r = story.note.reflection;
  const { tab } = state;
  const parked = story.looseEnds.filter((item) => item.noteId === story.note.id);

  return (
    <Sheet id="screen-note" labelledBy="note-title" open={state.screen === "note"} origin={state.origin} pull={state.pull}>
      <header className="screen-head">
        <button type="button" className="back-btn" id="note-back" aria-label={story.ui.backHome} onClick={actions.close}>
          <img src="/assets/back.svg" width={18} height={18} alt="" />
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

          <div role="tabpanel" className="tab-panel" id="panel-reflection" aria-labelledby="tab-reflection" tabIndex={0} hidden={tab !== "reflection"}>
            <section className="refl">
              <h2 className="eyebrow">{r.feelingsLabel}</h2>
              <div className="feel-bar" aria-hidden="true">
                {r.feelings.map((f) => (
                  <span key={f.word} style={{ ...feelingColor(f.color), flexGrow: f.share }} />
                ))}
              </div>
              <ul className="feel-tags">
                {r.feelings.map((f) => (
                  <li key={f.word} style={feelingColor(f.color)}>
                    <span className="feel-dot" aria-hidden="true" />
                    {f.word}
                    <span className="feel-share">{f.share}%</span>
                  </li>
                ))}
              </ul>
              <p className="refl-hint">{r.editHint}</p>
            </section>

            <section className="refl">
              <h2 className="eyebrow">{r.quoteLabel}</h2>
              <blockquote className="refl-quote">“{r.quote}”</blockquote>
            </section>

            <section className="refl">
              <h2 className="eyebrow">{r.themesLabel}</h2>
              <p className="themes">
                {r.themes.map((t, i) => (
                  <span key={t}>
                    {i > 0 && (
                      <span className="spark" aria-hidden="true">
                        ✦
                      </span>
                    )}
                    {t}
                  </span>
                ))}
              </p>
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

            <section className="refl">
              <h2 className="eyebrow">{r.threadsLabel}</h2>
              <ul className="threads">
                {r.threads.map((t) => (
                  <li key={t.text}>
                    <span>{t.text}</span>
                    <span className="parked-cat">{t.count}</span>
                  </li>
                ))}
              </ul>
            </section>

            <p className="sources-line">{r.sources}</p>
          </div>

          <div role="tabpanel" className="tab-panel" id="panel-transcript" aria-labelledby="tab-transcript" tabIndex={0} hidden={tab !== "transcript"}>
            <p className="prose transcript">{story.note.transcript}</p>
          </div>
        </div>
      </div>
    </Sheet>
  );
}
