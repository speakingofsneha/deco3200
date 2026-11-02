// centres the phone and keeps restart on its left.
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
      <a className="to-story" href="/">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Story</span>
      </a>
      <RestartButton label={restartLabel} onRestart={onRestart} />
      <MobileFrame phoneRef={phoneRef} dragging={dragging}>
        {children}
      </MobileFrame>
    </main>
  );
}

