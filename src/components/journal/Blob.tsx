// a floating voice note. the field artwork carries its own grain.
import type { Pastel } from "../../data/story";

const fields: Record<Pastel, string> = {
  rose: "/assets/field-rose.svg",
  apricot: "/assets/field-apricot.svg",
  sky: "/assets/field-sky.svg",
};

interface Props {
  id: string;
  label: string;
  color: Pastel;
  dots: number;
  ariaLabel: string;
  opens?: boolean;
  onOpen?: () => void;
}

export default function Blob({ id, label, color, dots, ariaLabel, opens = false, onOpen }: Props) {
  return (
    <button
      type="button"
      className="blob"
      data-blob={id}
      data-dots={dots}
      data-open-note={opens ? id : undefined}
      aria-label={ariaLabel}
      onClick={opens ? onOpen : undefined}
    >
      <span className="blob-visual" data-color={color} aria-hidden="true">
        <img className="blob-art" src={fields[color]} width={148.5} height={90.2} alt="" />
        {dots > 1 && <img className="blob-seed" src="/assets/seed.svg" width={4.95} height={5.5} alt="" />}
        {dots === 0 && color === "apricot" && <span className="blob-seed-cover" />}
      </span>
      <img className="blob-leader" src="/assets/dotted-leader.png" width={15} height={25} alt="" />
      <span className="note-label">{label}</span>
    </button>
  );
}
