// settings. one quiet list: lamp, quiet hours, connected apps, colours.
import { calColors, story } from "../../data/story";
import type { JournalActions, JournalState } from "../../journal/useJournal";
import Sheet from "./Sheet";

interface Props {
  state: JournalState;
  actions: JournalActions;
  onRestart: () => void;
}

function Toggle({ id, label, on, onToggle }: { id: string; label: string; on: boolean; onToggle: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={on} className="toggle" id={`toggle-${id}`} aria-label={label} onClick={onToggle}>
      <span className="toggle-knob" aria-hidden="true" />
    </button>
  );
}

export default function SettingsScreen({ state, actions, onRestart }: Props) {
  const s = story.settings;

  return (
    <Sheet id="screen-settings" labelledBy="settings-title" open={state.screen === "settings"} origin={state.origin} pull={state.pull}>
      <header className="screen-head">
        <button type="button" className="back-btn" aria-label={story.ui.backHome} onClick={actions.close}>
          <img src="/assets/back.svg" width={21} height={21} alt="" />
        </button>
        <h1 id="settings-title" tabIndex={-1}>
          {s.title}
        </h1>
      </header>

      <div className="settings-scroll" id="settings-scroll">
        <section className="set-group" aria-labelledby="set-lamp">
          <h2 className="eyebrow" id="set-lamp">{s.sections.lamp}</h2>
          <div className="set-card">
            <div className="set-row">
              <span className="set-text">
                <span className="set-label">{s.lamp.name}</span>
                <span className="set-detail">{s.lamp.status}</span>
              </span>
            </div>
            {s.lamp.toggles.map((t) => (
              <div className="set-row" key={t.id}>
                <span className="set-label">{t.label}</span>
                <Toggle id={t.id} label={t.label} on={state.settings[t.id]} onToggle={() => actions.toggleSetting(t.id)} />
              </div>
            ))}
          </div>
        </section>

        <section className="set-group" aria-labelledby="set-quiet">
          <h2 className="eyebrow" id="set-quiet">{s.sections.quiet}</h2>
          <div className="set-card">
            <div className="set-row">
              <span className="set-label">{s.quiet.label}</span>
              <span className="set-value">{s.quiet.value}</span>
            </div>
          </div>
        </section>

        <section className="set-group" aria-labelledby="set-context">
          <h2 className="eyebrow" id="set-context">{s.sections.context}</h2>
          <div className="set-card">
            {s.sources.map((src) => {
              const on = state.settings[src.id];
              return (
                <div className={on ? "set-row" : "set-row is-off"} key={src.id}>
                  <img className="app-logo" src={`/assets/logos/${src.id}.svg`} alt="" width={22} height={22} />
                  <span className="set-label">{src.name}</span>
                  <Toggle id={src.id} label={src.name} on={on} onToggle={() => actions.toggleSetting(src.id)} />
                </div>
              );
            })}
          </div>
        </section>

        <section className="set-group" aria-labelledby="set-colours">
          <h2 className="eyebrow" id="set-colours">{s.sections.colours}</h2>
          <div className="set-card">
            {s.colours.rows.map((row) => (
              <div className="set-row" key={row.category}>
                <span className="swatch" style={{ background: calColors[row.color].hex }} aria-hidden="true" />
                <span className="set-label">{row.category}</span>
                <span className="set-value">{calColors[row.color].name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="set-group" aria-labelledby="set-privacy">
          <h2 className="eyebrow" id="set-privacy">{s.sections.privacy}</h2>
          <div className="set-card">
            {s.privacy.map((row) => (
              <div className="set-row" key={row.id}>
                <span className="set-label">{row.label}</span>
              </div>
            ))}
          </div>
        </section>

        <button type="button" className="restart-row" onClick={onRestart}>
          {s.restart}
        </button>
      </div>
    </Sheet>
  );
}
