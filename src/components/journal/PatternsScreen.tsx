// the week at a distance: an emotion map (one dot per note), how the week felt,
// and the themes and threads that keep coming back. no advice, just patterns.
import { story } from "../../data/story";
import type { JournalActions, JournalState } from "../../journal/useJournal";
import { feelingColor } from "./NoteScreen";
import Sheet from "./Sheet";

interface Props {
  state: JournalState;
  actions: JournalActions;
}

const W = 340;
const H = 168;
const padX = 18;
const padY = 18;

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

      <div className="settings-scroll" id="patterns-scroll">
        <div className="range" role="group" aria-label="Time range">
          {p.ranges.map((r, i) => (
            <span key={r} className={i === 0 ? "range-opt is-on" : "range-opt"} aria-current={i === 0 ? "true" : undefined}>
              {r}
            </span>
          ))}
        </div>

        <section className="set-group" aria-labelledby="pat-map">
          <h2 className="eyebrow" id="pat-map">{p.mapLabel}</h2>
          <div className="emap">
            <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${p.mapLabel}. ${dots.map((d) => d.label).join(", ")}`}>
              <defs>
                <filter id="emap-soft" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
              </defs>
              {p.days.map((d, i) => (
                <line key={d} x1={x(i)} x2={x(i)} y1={padY - 6} y2={H - padY + 6} stroke="var(--color-line-soft)" strokeWidth="1" />
              ))}
              <path d={line} fill="none" stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.5" />
              {dots.map((d) => (
                <g key={d.id} className={d.recorded && state.arrived ? "emap-dot is-new" : "emap-dot"}>
                  <circle cx={x(d.day)} cy={y(d.y)} r="16" style={{ fill: `var(--color-${d.color})` }} filter="url(#emap-soft)" opacity="0.9" />
                  <circle cx={x(d.day)} cy={y(d.y)} r="4" fill="var(--color-ink)" />
                </g>
              ))}
            </svg>
            <div className="emap-axis" aria-hidden="true">
              <span>{p.axisHigh}</span>
              <span>{p.axisLow}</span>
            </div>
            <div className="emap-days" aria-hidden="true">
              {p.days.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
          <p className="refl-hint">{p.mapHint}</p>
        </section>

        <section className="set-group" aria-labelledby="pat-feel">
          <h2 className="eyebrow" id="pat-feel">{p.feelingsLabel}</h2>
          <ul className="feel-rows">
            {p.feelings.map((f) => (
              <li key={f.word} style={feelingColor(f.color)}>
                <span className="feel-word">
                  <span className="feel-dot" aria-hidden="true" />
                  {f.word}
                </span>
                <span className="feel-track" aria-hidden="true">
                  <span style={{ width: `${f.share}%` }} />
                </span>
                <span className="feel-share">{f.share}%</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="set-group" aria-labelledby="pat-themes">
          <h2 className="eyebrow" id="pat-themes">{p.themesLabel}</h2>
          <p className="themes themes--big">
            {p.themes.map((t, i) => (
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

        <section className="set-group" aria-labelledby="pat-threads">
          <h2 className="eyebrow" id="pat-threads">{p.threadsLabel}</h2>
          <ul className="pat-list">
            {p.threads.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>

        <section className="set-group" aria-labelledby="pat-new">
          <h2 className="eyebrow" id="pat-new">{p.newLabel}</h2>
          <ul className="pat-list">
            {p.newer.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      </div>
    </Sheet>
  );
}
