// the four screens, plus the drag ghost, let-go bin, and undo toast.
import { story } from "../../data/story";
import { looseEnd } from "../../journal/model";
import type { JournalActions, JournalState } from "../../journal/useJournal";
import DayScreen from "./DayScreen";
import HomeScreen from "./HomeScreen";
import NoteScreen from "./NoteScreen";
import WeekScreen from "./WeekScreen";

interface Props {
  state: JournalState;
  actions: JournalActions;
}

export default function JournalApp({ state, actions }: Props) {
  const dragging = state.drag;
  const ghost = dragging ? looseEnd(dragging.id) : null;
  const letGoClass = ["letgo", dragging ? "is-on" : "", dragging?.overBin ? "is-hot" : ""].filter(Boolean).join(" ");

  return (
    <>
      <div className="app" id="app">
        <div
          className={state.screen === "note" || state.screen === "day" ? "track is-covered" : "track"}
          id="track"
          style={{
            transform: `translate3d(${state.trackX}px, 0, 0)`,
            transition: state.trackLive || !state.ready ? "none" : undefined,
          }}
        >
          <HomeScreen items={state.items} active={state.screen === "home"} pulse={state.pulse} actions={actions} />
          <WeekScreen items={state.items} active={state.screen === "week"} menuId={state.menuId} drag={state.drag} actions={actions} />
        </div>
        <NoteScreen open={state.screen === "note"} playing={state.playing} tab={state.tab} actions={actions} />
        <DayScreen open={state.screen === "day"} items={state.items} actions={actions} />
      </div>

      <div id="letgo" className={letGoClass} aria-hidden="true">
        <div className="letgo-pill">
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4.5 7.2h15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M9.2 7.1V5.4h5.6v1.7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
            <path d="M7.4 7.2l.8 12.2h7.6l.8-12.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          </svg>
          <span>{story.ui.letGo}</span>
        </div>
      </div>

      <div className={state.toast ? "toast is-on" : "toast"} id="toast" role="status" aria-live="polite">
        <div className="toast-inner">
          <span>{story.ui.toast}</span>
          <span className="toast-dot" aria-hidden="true">
            ·
          </span>
          <button type="button" id="toast-undo" onClick={actions.undo}>
            {story.ui.undo}
          </button>
        </div>
      </div>

      {ghost && dragging && (
        <div className="ghost" data-color={ghost.color} style={{ left: dragging.x, top: dragging.y }}>
          <span className="ghost-grip" aria-hidden="true" />
          <span>{ghost.title}</span>
        </div>
      )}
    </>
  );
}
