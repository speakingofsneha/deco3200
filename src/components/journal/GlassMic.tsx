// the glass mic. tapping it opens the recording screen.
import { url } from "../../lib/path";
interface Props {
  label: string;
  hint: string | null;
  onTap: (from: Element) => void;
}

export default function GlassMic({ label, hint, onTap }: Props) {
  return (
    <div className="mic-wrap">
      {hint && (
        <span className="mic-hint" aria-hidden="true">
          {hint}
        </span>
      )}
      <button type="button" className={hint ? "mic is-inviting" : "mic"} id="mic" aria-label={label} onClick={(event) => onTap(event.currentTarget)}>
        <img src={url("/assets/mic.svg")} width={24} height={24} alt="" />
      </button>
    </div>
  );
}
