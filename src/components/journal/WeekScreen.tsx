// week strip. parked notes sit in the tray until they are placed.
import { parkedLabel, story } from "../../data/story";
import { parkedCount, weekCardHeight, weekOrder, type Items } from "../../journal/model";
import type { JournalActions, DragVisual } from "../../journal/useJournal";
import CalendarItem from "./CalendarItem";
import LooseEndChip from "./LooseEndChip";

interface Props {
  items: Items;
  active: boolean;
  menuId: string | null;
  drag: DragVisual | null;
  actions: JournalActions;
}

export default function WeekScreen({ items, active, menuId, drag, actions }: Props) {
  const parked = parkedCount(items);
  const clear = parked === 0;

  return (
    <section className={clear ? "pane week is-clear" : "pane week"} id="screen-week" aria-labelledby="week-title" inert={!active}>
      <header className="week-head">
        <h1 id="week-title" tabIndex={-1}>
          {story.week.title}
        </h1>
      </header>
      <div className="week-body">
        <div className="day-scroller" id="day-scroller">
          {story.week.days.map((day) => {
            const placed = story.looseEnds
              .filter((meta) => items[meta.id]?.place === day.id)
              .map((meta) => ({ meta, item: items[meta.id], order: weekOrder(items[meta.id], meta) }));
            const imported = day.id === "fri" ? story.week.imported : [];
            const cards = [
              ...imported.map((event) => ({ order: event.order, id: event.id, kind: "imported" as const, event })),
              ...placed.map(({ meta, item, order }) => ({ order, id: meta.id, kind: "note" as const, meta, item })),
            ].sort((a, b) => a.order - b.order);

            return (
              <div key={day.id} className={drag?.hotDay === day.id ? "day-col is-hot" : "day-col"} data-day={day.id}>
                {day.id === "fri" ? (
                  <button type="button" className="day-head is-open" data-open-day={day.id} aria-label={story.week.openFriday} onClick={actions.openDay}>
                    <span className="dow">{day.name}</span>
                    <span className="dom">{day.date}</span>
                  </button>
                ) : (
                  <div className="day-head" aria-current={day.isToday ? "date" : undefined}>
                    <span className="dow">{day.name}</span>
                    <span className="dom">{day.date}</span>
                    {day.isToday && <span className="sr-only">{story.ui.today}</span>}
                  </div>
                )}
                <div className="day-items">
                  {cards.map((card) =>
                    card.kind === "imported" ? (
                      <CalendarItem
                        key={card.id}
                        variant="imported"
                        itemId={card.event.id}
                        title={card.event.title}
                        tint={card.event.tint}
                        source={card.event.source}
                        sourceName={card.event.sourceName}
                        accessibleName={`${card.event.title}, ${card.event.time}, ${card.event.sourceName}`}
                      />
                    ) : (
                      <CalendarItem
                        key={card.id}
                        variant="note"
                        week
                        height={weekCardHeight(card.meta)}
                        itemId={card.meta.id}
                        title={card.meta.title}
                        color={card.meta.color}
                      />
                    ),
                  )}
                  {drag?.hotDay === day.id && <div className="placeholder" />}
                </div>
              </div>
            );
          })}
        </div>
        <aside className={drag?.active ? "tray is-away" : clear ? "tray is-clear" : "tray"} id="tray">
          <p className="tray-count" id="tray-status" aria-live="polite">
            {parkedLabel(parked)}
          </p>
          <div className="tray-rows">
            {story.looseEnds
              .filter((item) => items[item.id]?.place === "tray")
              .map((item) => (
                <LooseEndChip
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  color={item.color}
                  lifted={Boolean(drag?.active && drag.id === item.id)}
                  menuOpen={menuId === item.id}
                  actions={actions}
                />
              ))}
          </div>
        </aside>
      </div>
      <button
        type="button"
        className="edge-tab edge-tab--left"
        data-open-home=""
        aria-label={story.ui.openHome}
        onClick={actions.openHome}
      >
        <span className="tab-visual" aria-hidden="true">
          {">"}
        </span>
      </button>
    </section>
  );
}
