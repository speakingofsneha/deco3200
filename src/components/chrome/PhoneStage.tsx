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
      <RestartButton label={restartLabel} onRestart={onRestart} />
      <MobileFrame phoneRef={phoneRef} dragging={dragging}>
        {children}
      </MobileFrame>
    </main>
  );
}

