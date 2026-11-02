// a parked loose end. drag the row, or use the grip to place it.
import { url } from "../../lib/path";
import { calColors, letGoLabel, moveLabel, story, type CalColor } from "../../data/story";
import type { JournalActions } from "../../journal/useJournal";

interface Props {
  id: string;
  title: string;
  color: CalColor;
  lifted: boolean;
  menuOpen: boolean;
  actions: JournalActions;
}

export default function LooseEndChip({ id, title, color, lifted, menuOpen, actions }: Props) {
  return (
    <div className={lifted ? "tray-row is-lifted" : "tray-row"} data-chip={id} style={{ "--cal": calColors[color].hex } as React.CSSProperties}>
      <span className="cal-dot" aria-hidden="true" />
      <span className="row-label">{title}</span>
      <button
        type="button"
        className="move-btn"
        id={`move-${id}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={`menu-${id}`}
        aria-label={moveLabel(title)}
        onClick={() => actions.toggleMenu(id)}
      >
        <img src={url("/assets/grip.svg")} width={16} height={16} alt="" />
      </button>
      <div className="menu" id={`menu-${id}`} role="menu" hidden={!menuOpen}>
        {story.moveDays.map((day) => (
          <button key={day.id} type="button" role="menuitem" aria-label={day.aria} onClick={() => actions.chooseMove(id, day.id)}>
            {day.label}
          </button>
        ))}
        <button type="button" role="menuitem" data-move="letgo" aria-label={letGoLabel(title)} onClick={() => actions.chooseMove(id, "letgo")}>
          {story.ui.letGo}
        </button>
      </div>
    </div>
  );
}
