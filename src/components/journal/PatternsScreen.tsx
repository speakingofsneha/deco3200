// the week at a distance: an emotion map (one orb per note), how the week felt,
// and its overarching themes. no advice, just patterns, with room to breathe.
import { story } from "../../data/story";
import type { JournalActions, JournalState } from "../../journal/useJournal";
import FeelingOrbs from "./FeelingOrbs";
import Sheet from "./Sheet";

interface Props {
  state: JournalState;
  actions: JournalActions;
}

const W = 340;
const H = 200;
const padX = 20;
const padY = 30;

export default function PatternsScreen({ state, actions }: Props) {
  const p = story.patterns;
  const dots = p.dots.filter((d) => !d.recorded || state.recorded);
  const x = (day: number) => padX + (day * (W - padX * 2)) / 6;
  const y = (v: number) => H - padY - v * (H - padY * 2);
  const line = dots.map((d, i) => `${i ? "L" : "M"}${x(d.day)} ${y(d.y)}`).join(" ");

  return (
    <Sheet id="screen-patterns" labelledBy="patterns-title" open={state.screen === "patterns"} origin={state.origin} pull={state.pull}>
      <header className="screen-head">
        <button type="button" className="back-btn" aria-label={story.ui.backHome} onClick={actions.close}>
          <img src="/assets/back.svg" width={18} height={18} alt="" />
        </button>
        <h1 id="patterns-title" tabIndex={-1}>
          {p.title}
          <span className="head-sub">{p.range}</span>
        </h1>
      </header>

      <div className="settings-scroll pat-scroll" id="patterns-scroll">
        <section className="pat-block" aria-labelledby="pat-map">
          <h2 className="pat-label" id="pat-map">{p.mapLabel}</h2>
          <div className="emap">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${p.mapLabel}. ${dots.map((d) => d.label).join(", ")}`}>
              <defs>
                <filter id="emap-soft" x="-80%" y="-80%" width="260%" height="260%">
                  <feGaussianBlur stdDeviation="9" />
                </filter>
              </defs>
              <path d={line} fill="none" stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.45" />
              {dots.map((d) => (
                <g key={d.id} className={d.recorded && state.arrived ? "emap-dot is-new" : "emap-dot"}>
                  <circle cx={x(d.day)} cy={y(d.y)} r="22" style={{ fill: `var(--color-${d.color})` }} filter="url(#emap-soft)" />
                  <circle cx={x(d.day)} cy={y(d.y)} r="3.5" fill="var(--color-ink)" />
                </g>
              ))}
            </svg>
            <div className="emap-axis" aria-hidden="true">
              <span>{p.axisHigh}</span>
              <span>{p.axisLow}</span>
            </div>
            <div className="emap-days" aria-hidden="true">
              {p.days.map((d) => (
                <span key={d}>{d.slice(0, 1)}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="pat-block" aria-labelledby="pat-feel">
          <h2 className="pat-label" id="pat-feel">{p.feelingsLabel}</h2>
          <FeelingOrbs feelings={p.feelings} large />
        </section>

        <section className="pat-block" aria-labelledby="pat-themes">
          <h2 className="pat-label" id="pat-themes">{p.themesLabel}</h2>
          <ul className="theme-lines theme-lines--big">
            {p.themes.map((t) => (
              <li key={t}>
                <span className="spark" aria-hidden="true">
                  ✦
                </span>
                {t}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Sheet>
  );
}
