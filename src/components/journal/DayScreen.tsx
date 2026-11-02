// friday. suggested blocks can be accepted or dismissed.
import { url } from "../../lib/path";
import { acceptLabel, dismissLabel, story } from "../../data/story";
import { dayBlockHeight, type Items } from "../../journal/model";
import type { JournalActions, JournalState } from "../../journal/useJournal";
import CalendarItem from "./CalendarItem";
import Sheet from "./Sheet";

interface Props {
  state: JournalState;
  actions: JournalActions;
}

export default function DayScreen({ state, actions }: Props) {
  const items: Items = state.items;
  const [standup, crit] = story.week.imported;
  const onFriday = story.looseEnds.filter((meta) => items[meta.id]?.place === "fri" && items[meta.id]?.suggestion !== "dismissed");
  const pending = onFriday.filter((meta) => items[meta.id]?.suggestion === "pending").length;
  const planned = onFriday.length > 0 && pending === 0;

  return (
    <Sheet id="screen-day" labelledBy="day-title" open={state.screen === "day"} origin={state.origin} pull={state.pull}>
      <header className="screen-head screen-head--day">
        <button type="button" className="back-btn" id="day-back" aria-label={story.ui.backWeek} onClick={actions.close}>
          <img src={url("/assets/back.svg")} width={18} height={18} alt="" />
        </button>
        <h1 id="day-title" tabIndex={-1}>
          {story.day.title}
        </h1>
      </header>
      <div className="day-scroll" id="day-scroll">
        <div className="day-board" id="timeline">
          <div className="day-row">
            <div className="day-times">
              <span>{standup.clock}</span>
            </div>
            <CalendarItem
              variant="imported"
              itemId={standup.id}
              title={standup.dayTitle}
              color={standup.color}
              source={standup.source}
              sourceName={standup.sourceName}
              accessibleName={`${standup.title}, ${standup.time}, ${standup.sourceName}`}
              height={76}
            />
          </div>
          {story.looseEnds.map((meta) => {
            const item = items[meta.id];
            if (!item || item.place !== "fri" || item.suggestion === "dismissed") return null;
            return (
              <div key={meta.id} className="day-row">
                <div className="day-times" style={{ height: dayBlockHeight(meta) }}>
                  <span>{meta.clock}</span>
                  {meta.clockEnd && <span>{meta.clockEnd}</span>}
                </div>
                <CalendarItem
                  variant="suggested"
                  itemId={meta.id}
                  title={meta.title}
                  color={meta.color}
                  time={meta.time}
                  acceptLabel={acceptLabel(meta.title)}
                  dismissLabel={dismissLabel(meta.title)}
                  accepted={item.suggestion === "accepted"}
                  height={dayBlockHeight(meta)}
                  onAccept={() => actions.accept(meta.id)}
                  onDismiss={() => actions.dismiss(meta.id)}
                />
              </div>
            );
          })}
          <div className="day-gap" aria-hidden="true" />
          <div className="day-row">
            <div className="day-times">
              <span>{crit.clock}</span>
            </div>
            <CalendarItem
              variant="imported"
              itemId={crit.id}
              title={crit.dayTitle}
              color={crit.color}
              source={crit.source}
              sourceName={crit.sourceName}
              accessibleName={`${crit.title}, ${crit.time}, ${crit.sourceName}`}
              height={76}
            />
          </div>
        </div>
        <div className="day-foot">
          {pending > 1 && (
            <button type="button" className="quiet-btn" onClick={actions.acceptAll}>
              {story.day.acceptBoth}
            </button>
          )}
          <p className="calm-line" role="status" aria-live="polite">
            {planned ? story.day.planned : ""}
          </p>
        </div>
      </div>
    </Sheet>
  );
}
