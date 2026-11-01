// fake playback. played bars are ink; the rest stay as the rule color.
const bars = [4, 11, 18, 25, 9, 16, 23, 7, 14, 21, 5, 12, 19, 26, 10, 17, 24, 8, 15, 22, 6, 13, 20, 4, 11, 18, 25, 9, 16];
const playedUntil = 11;

interface Props {
  duration: string;
  playing: boolean;
  playLabel: string;
  pauseLabel: string;
  onToggle: () => void;
}

export default function Player({ duration, playing, playLabel, pauseLabel, onToggle }: Props) {
  return (
    <div className="player">
      <button
        type="button"
        className="play"
        id="play-toggle"
        aria-pressed={playing}
        aria-label={playing ? pauseLabel : playLabel}
        onClick={onToggle}
      >
        <img className="icon-play" src="/assets/play.svg" width={20} height={20} alt="" />
        <svg className="icon-pause" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
          <path d="M6 4.2h2.4v11.6H6zM11.6 4.2H14v11.6h-2.4z" fill="#20211f" />
        </svg>
      </button>
      <div className={playing ? "waveform is-playing" : "waveform"} id="waveform" aria-hidden="true">
        {bars.map((height, index) => (
          <span key={index} className={index < playedUntil ? "bar is-played" : "bar"} style={{ height }} />
        ))}
      </div>
      <span className="player-time">{duration}</span>
    </div>
  );
}
