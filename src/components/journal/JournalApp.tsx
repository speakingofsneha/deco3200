// every screen, plus the drag ghost, let-go bin, and undo toast.
// home and week share a swipe track; the week slides over home while home eases back.
import type { CSSProperties } from "react";
import { calColors, story } from "../../data/story";
import { isOverlay, looseEnd, phoneWidth } from "../../journal/model";
import type { JournalActions, JournalState } from "../../journal/useJournal";
import DayScreen from "./DayScreen";
import HomeScreen from "./HomeScreen";
import NoteScreen from "./NoteScreen";
import PatternsScreen from "./PatternsScreen";
import RecordingScreen from "./RecordingScreen";
import SettingsScreen from "./SettingsScreen";
import WeekScreen from "./WeekScreen";

interface Props {
  state: JournalState;
  actions: JournalActions;
}

export default function JournalApp({ state, actions }: Props) {
  const dragging = state.drag;
  const ghost = dragging ? looseEnd(dragging.id) : null;
  const letGoClass = ["letgo", dragging ? "is-on" : "", dragging?.overBin ? "is-hot" : ""].filter(Boolean).join(" ");

  // 0 on home, 1 on the week
  const progress = Math.min(1, Math.max(0, -state.trackX / phoneWidth));
  const still = state.trackLive || !state.ready;
  const homeStyle = {
    transform: `translate3d(${progress * phoneWidth * 0.72}px, 0, 0) scale(${1 - progress * 0.06})`,
    opacity: 1 - progress * 0.45,
    borderRadius: `${progress * 28}px`,
    transition: still ? "none" : undefined,
  } as CSSProperties;

  return (
    <>
      <div className="app" id="app">
        <div
          className="track"
          id="track"
          style={{
            transform: `translate3d(${state.trackX}px, 0, 0)`,
            transition: still ? "none" : undefined,
          }}
        >
          <div className="pane-slot pane-slot--home" style={homeStyle}>
            <HomeScreen
              items={state.items}
              active={state.screen === "home"}
              recorded={state.recorded}
              arrived={state.arrived}
              actions={actions}
            />
          </div>
          <div className="pane-slot pane-slot--week" style={{ boxShadow: `-24px 0 48px rgb(40 34 24 / ${0.1 * (1 - Math.abs(progress - 0.5) * 2) + 0.02})` }}>
            <WeekScreen
              items={state.items}
              recorded={state.recorded}
              active={state.screen === "week"}
              menuId={state.menuId}
              drag={state.drag}
              actions={actions}
            />
          </div>
        </div>
        <div className={isOverlay(state.screen) ? "scrim is-on" : "scrim"} aria-hidden="true" style={state.pull ? { opacity: Math.max(0, 1 - Math.max(state.pull.x, state.pull.y) / 300), transition: "none" } : undefined} />
        <NoteScreen state={state} actions={actions} />
        <DayScreen state={state} actions={actions} />
        <SettingsScreen state={state} actions={actions} onRestart={actions.restart} />
        <PatternsScreen state={state} actions={actions} />
        <RecordingScreen state={state} actions={actions} />
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
        <div className="ghost" style={{ left: dragging.x, top: dragging.y, "--cal": calColors[ghost.color].hex } as CSSProperties}>
          <span className="ghost-grip" aria-hidden="true" />
          <span>{ghost.title}</span>
        </div>
      )}
    </>
  );
}
