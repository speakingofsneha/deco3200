// feelings as soft orbs: each one sized by how much of the note (or week) it held.
import type { CSSProperties } from "react";
import type { Feeling } from "../../data/story";

interface Props {
  feelings: Feeling[];
  large?: boolean;
}

export default function FeelingOrbs({ feelings, large = false }: Props) {
  const top = Math.max(...feelings.map((f) => f.share));
  const max = large ? 92 : 100;
  const min = large ? 46 : 48;

  return (
    <ul className={large ? "feel-orbs is-large" : "feel-orbs"}>
      {feelings.map((f) => {
        const size = Math.round(min + ((max - min) * f.share) / top);
        return (
          <li key={f.word} style={{ "--feel": `var(--color-${f.color})`, "--size": `${size}px` } as CSSProperties}>
            <span className="feel-orb" aria-hidden="true" />
            <span className="feel-word">{f.word}</span>
            <span className="feel-share">{f.share}%</span>
          </li>
        );
      })}
    </ul>
  );
}
