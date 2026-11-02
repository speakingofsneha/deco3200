// a voice note on home: an orb, a dotted leader, and a serif label.
import type { CSSProperties } from "react";
import { orbScale, type OrbColor } from "../../data/story";
import Orb from "./Orb";

interface Props {
  id: string;
  index: number;
  label: string;
  meta: string;
  minutes: number;
  colors: [OrbColor, OrbColor];
  dots: number;
  ariaLabel: string;
  opens?: boolean;
  arriving?: boolean;
  onOpen?: (from: Element) => void;
}

export default function Blob({ id, index, label, meta, minutes, colors, dots, ariaLabel, opens = false, arriving = false, onOpen }: Props) {
  return (
    <button
      type="button"
      className={arriving ? "blob is-arriving" : "blob"}
      data-blob={id}
      data-dots={dots}
      data-open-note={opens ? id : undefined}
      aria-label={ariaLabel}
      aria-disabled={opens ? undefined : true}
      style={{ "--orb": orbScale(minutes) } as CSSProperties}
      onClick={opens && onOpen ? (event) => onOpen(event.currentTarget) : undefined}
    >
      <Orb className="blob-orb" colors={colors} dots={dots} variant={index} seed={index * 11 + 3} />
      <span className="blob-leader" aria-hidden="true" />
      <span className="note-label">{label}</span>
      <span className="note-meta">{meta}</span>
    </button>
  );
}
