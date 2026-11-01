// journal page. one react tree: the phone card, status bar, and the four screens.
import { useRef } from "react";
import { story } from "../../data/story";
import { useJournal } from "../../journal/useJournal";
import PhoneStage from "../chrome/PhoneStage";
import StatusBar from "../chrome/StatusBar";
import JournalApp from "./JournalApp";

export default function JournalPage() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const journal = useJournal(phoneRef);

  return (
    <PhoneStage
      phoneRef={phoneRef}
      restartLabel={story.restart}
      onRestart={journal.actions.restart}
      dragging={Boolean(journal.state.drag)}
    >
      <StatusBar time={story.statusTime} />
      <JournalApp state={journal.state} actions={journal.actions} />
    </PhoneStage>
  );
}
