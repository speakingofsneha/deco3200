// centres the phone and keeps restart on its left.
import { url } from "../../lib/path";
import type { ReactNode, Ref } from "react";
import MobileFrame from "./MobileFrame";
import RestartButton from "./RestartButton";

interface Props {
  phoneRef: Ref<HTMLDivElement>;
  restartLabel: string;
  onRestart: () => void;
  dragging?: boolean;
  children: ReactNode;
}

export default function PhoneStage({ phoneRef, restartLabel, onRestart, dragging, children }: Props) {
  return (
    <main className="stage">
      <a className="to-story" href={url("/")} aria-label="Back to the story">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
      <RestartButton label={restartLabel} onRestart={onRestart} />
      <MobileFrame phoneRef={phoneRef} dragging={dragging}>
        {children}
      </MobileFrame>
    </main>
  );
}

