// the open voice note. synthesis and transcript share one player.
import { story } from "../../data/story";
import type { JournalActions } from "../../journal/useJournal";
import Player from "./Player";

interface Props {
  open: boolean;
  playing: boolean;
  tab: string;
  actions: JournalActions;
}

export default function NoteScreen({ open, playing, tab, actions }: Props) {
  const synthesis = story.note.synthesis;

  return (
    <section className={open ? "overlay is-open" : "overlay"} id="screen-note" aria-labelledby="note-title" aria-hidden={!open} inert={!open}>
      <header className="screen-head">
        <button type="button" className="back-btn" id="note-back" aria-label={story.ui.backHome} onClick={actions.backFromNote}>
          <img src="/assets/back.svg" width={21} height={21} alt="" />
        </button>
        <h1 id="note-title" tabIndex={-1}>
          {story.note.title}
        </h1>
      </header>
      <div className="note-scroll" id="note-scroll">
        <Player
          duration={story.note.duration}
          playing={playing}
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
          </div>
          <div role="tabpanel" className="tab-panel" id="panel-transcript" aria-labelledby="tab-transcript" tabIndex={0} hidden={tab !== "transcript"}>
            <p className="prose transcript">{story.note.transcript}</p>
          </div>
        </div>
        {tab === "synthesis" && (
          <section className="sit">
            <h3 className="eyebrow">{synthesis.sitWithLabel}</h3>
            <p className="sit-quote">{synthesis.sitWith}</p>
          </section>
        )}
      </div>
    </section>
  );
}
