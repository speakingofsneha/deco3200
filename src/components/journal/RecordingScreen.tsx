// talking to bloom. the orb grows as the note gets longer; words arrive as they are said.
import { story } from "../../data/story";
import { clockOf } from "../../journal/model";
import type { JournalActions, JournalState } from "../../journal/useJournal";
import Orb from "./Orb";
import Sheet from "./Sheet";

interface Props {
  state: JournalState;
  actions: JournalActions;
}

const words = story.recording.live.split(" ");

export default function RecordingScreen({ state, actions }: Props) {
  const open = state.screen === "recording";
  const sorting = state.recPhase === "sorting";
  // about three words a second, so the demo reads like speech
  const shown = Math.min(words.length, state.recSeconds * 3 + 2);
  const recent = words.slice(Math.max(0, shown - 14), shown).join(" ");
  const grow = Math.min(1.25, 0.9 + state.recSeconds * 0.012);

  return (
    <Sheet id="screen-recording" labelledBy="rec-title" open={open} origin={state.origin} pull={state.pull} className="rec">
      <header className="rec-head">
        <button type="button" className="back-btn" aria-label={story.recording.cancel} onClick={actions.close}>
          <img src="/assets/close.svg" width={18} height={18} alt="" />
        </button>
        <h1 id="rec-title" tabIndex={-1} className="rec-status">
          <span className={sorting ? "rec-light is-done" : "rec-light"} aria-hidden="true" />
          {sorting ? story.recording.sorting : story.recording.listening}
        </h1>
      </header>

      <div className={sorting ? "rec-stage is-sorting" : "rec-stage"}>
        <div className="rec-orb" style={{ transform: `scale(${sorting ? 0.55 : grow})` }}>
          <Orb colors={["apricot", "rose"]} dots={sorting ? 2 : 0} variant={0} seed={41} className="rec-orb-svg" />
        </div>
        <p className="rec-time" aria-live="off">
          {clockOf(state.recSeconds)}
        </p>
        <p className="rec-words" aria-hidden="true">
          {sorting ? "" : recent}
        </p>
      </div>

      <div className="rec-foot">
        <button type="button" className="stop" aria-label={story.recording.stop} onClick={actions.stopRecording} disabled={sorting}>
          <span className="stop-square" aria-hidden="true" />
        </button>
      </div>
    </Sheet>
  );
}
