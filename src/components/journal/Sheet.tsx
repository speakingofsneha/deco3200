// a screen that grows out of whatever opened it, and follows the finger
// when it is pulled down or swiped from the left edge to close.
import type { CSSProperties, ReactNode } from "react";
import type { Point } from "../../journal/useJournal";

interface Props {
  id: string;
  labelledBy: string;
  open: boolean;
  origin: Point;
  pull: Point | null;
  className?: string;
  children: ReactNode;
}

export default function Sheet({ id, labelledBy, open, origin, pull, className, children }: Props) {
  const style: CSSProperties & Record<string, string | number> = {
    "--ox": `${origin.x}px`,
    "--oy": `${origin.y}px`,
  };
  if (open && pull) {
    const travel = Math.max(pull.x, pull.y);
    const scale = 1 - Math.min(0.12, travel / 1600);
    style.transform = `translate3d(${pull.x}px, ${pull.y}px, 0) scale(${scale})`;
    style.borderRadius = `${Math.min(40, 12 + travel / 6)}px`;
    style.transition = "none";
  }

  return (
    <section
      className={["overlay", open ? "is-open" : "", pull ? "is-pulled" : "", className ?? ""].filter(Boolean).join(" ")}
      id={id}
      aria-labelledby={labelledBy}
      aria-hidden={!open}
      inert={!open}
      style={style}
    >
      <span className="grabber" aria-hidden="true" />
      {children}
    </section>
  );
}
