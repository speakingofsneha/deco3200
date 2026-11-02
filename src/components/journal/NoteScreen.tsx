// the open voice note. synthesis and transcript share one player.
import { calColors, story } from "../../data/story";
import type { JournalActions, JournalState } from "../../journal/useJournal";
import Player from "./Player";
import Sheet from "./Sheet";

interface Props {
  state: JournalState;
  actions: JournalActions;
}

export default function NoteScreen({ state, actions }: Props) {
  const synthesis = story.note.synthesis;
  const { tab } = state;
  const parked = story.looseEnds.filter((item) => item.noteId === story.note.id);

  return (
    <Sheet id="screen-note" labelledBy="note-title" open={state.screen === "note"} origin={state.origin} pull={state.pull}>
      <header className="screen-head">
        <button type="button" className="back-btn" id="note-back" aria-label={story.ui.backHome} onClick={actions.close}>
          <img src="/assets/back.svg" width={21} height={21} alt="" />
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
            <h2>
              <img src="/assets/sparkles.svg" width={15} height={15} alt="" />
              <span>{synthesis.heading}</span>
            </h2>
            <p className="prose">{synthesis.body}</p>
            <p className="prose">{synthesis.supporting}</p>
            <ul className="tag-line">
              {synthesis.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
            <h3 className="eyebrow parked-head">{synthesis.parkedLabel}</h3>
            <ul className="parked-list">
              {parked.map((item) => (
                <li key={item.id}>
                  <span className="cal-dot" style={{ background: calColors[item.color].hex }} aria-hidden="true" />
                  <span className="parked-title">{item.title}</span>
                  <span className="parked-cat">{item.category}</span>
                </li>
              ))}
            </ul>
          </div>
          <div role="tabpanel" className="tab-panel" id="panel-transcript" aria-labelledby="tab-transcript" tabIndex={0} hidden={tab !== "transcript"}>
            <p className="prose transcript">{story.note.transcript}</p>
          </div>
        </div>
        {tab === "synthesis" && (
          <>
            <section className="sit">
              <h3 className="eyebrow">{synthesis.sitWithLabel}</h3>
              <p className="sit-quote">{synthesis.sitWith}</p>
            </section>
            <p className="sources-line">{synthesis.sources}</p>
          </>
        )}
      </div>
    </Sheet>
  );
}
