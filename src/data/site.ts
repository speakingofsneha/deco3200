// copy for the story site at /. every word on the page lives here.
import { url } from "../lib/path";

export interface Pill {
  label: string;
  title: string;
  body: string[];
  refs?: string[];
}

export type Block =
  | { kind: "line"; text: string[]; label?: string }
  | { kind: "big"; text: string[] }
  | { kind: "phone"; caption: string; src?: string; pill?: Pill }
  | { kind: "photo"; caption: string; src?: string }
  | { kind: "divider" };

export const site = {
  title: "bloom",
  description: "bloom, a journal you talk to at the end of the workday. A lamp on your desk listens; a quiet app reflects back your feelings, patterns and loose ends.",
  nav: [
    { label: "story", href: "#story" },
    { label: "demo", href: url("/demo") },
  ],
  intro: [
    "Working from home took away the commute, and with it, the end of the workday. bloom is a journal you talk to when work is done: a lamp on your desk that listens, and a quiet app that reflects your day back to you.",
    "Discover bloom through Sam's evening.",
  ],
};

export const story: Block[] = [
  {
    kind: "line",
    text: [
      "Sam is a designer who works from a studio flat. The desk is three steps from the bed, so the workday never really ends.",
      "Journaling is one of the most recommended ways to unwind. But a blank page at 7pm feels like one more task.",
    ],
  },
  {
    kind: "photo",
    caption: "Photo — bloom on Sam's desk at dusk, beside a closed laptop. Its petals glow softly.",
  },
  {
    kind: "line",
    text: ["6:42pm. Sam closes the laptop, touches bloom, and talks. No prompts, no structure. Just a stream of consciousness."],
  },
  {
    kind: "phone",
    caption: "Recording: a peach orb grows with Sam's voice, the timer runs and words drift past. Sam taps stop.",
    src: url("/assets/story/recording.mp4"),
    pill: {
      label: "why talk it out",
      title: "why talk it out",
      body: [
        "Journaling is one of the most recommended ways to process a day, and stream of consciousness is the easiest way in: nothing to organise first. But writing takes energy that's gone by evening. Speaking doesn't.",
        "Talking about a stressful experience out loud has shown benefits at least as strong as writing about it. Putting a feeling into words calms the brain's alarm response to it.",
        "And unfinished tasks keep replaying until they have a plan. Making the plan is enough to quiet them. People who wrote a specific to-do list before bed fell asleep faster.",
      ],
      refs: [
        "Esterling et al. (1994), Journal of Consulting and Clinical Psychology",
        "Lieberman et al. (2007), Psychological Science",
        "Masicampo & Baumeister (2011), Journal of Personality and Social Psychology",
        "Scullin et al. (2018), Journal of Experimental Psychology: General",
      ],
    },
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["bloom doesn't reply. It reflects: the feelings in what Sam said, the themes underneath, and what's still unfinished."],
  },
  {
    kind: "phone",
    caption: "The synthesis of Sam's note: feelings as soft orbs sized by how much of the note they held, the themes, and two loose ends. Then the messy transcript.",
    src: url("/assets/story/note.mp4"),
    pill: {
      label: "emotion tagging",
      title: "emotion tagging",
      body: [
        "Every note is tagged with the feelings in it, close to the words Sam used. Each feeling has a colour and a size, so a note's orb becomes a quick read of the day: apricot for clarity, rose for tension. The longer the note, the bigger the orb.",
        "There's no chat and no advice. bloom holds up a mirror; it doesn't answer back.",
      ],
    },
  },
  {
    kind: "line",
    text: ["Every note becomes an orb. Its colour is how the day felt, its size is how long Sam talked, and its dots are what's still open."],
  },
  {
    kind: "phone",
    caption: "Home: the new orb settles beside the week's notes and two dots appear inside it.",
    src: url("/assets/story/arrival.mp4"),
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["People rarely look back on what they've journaled, though most wish they did. bloom does the looking back, gathering the week into patterns Sam can actually see."],
  },
  {
    kind: "phone",
    caption: "This week: an emotion map with one orb per note, how the week felt, and its overarching themes.",
    src: url("/assets/story/patterns.mp4"),
    pill: {
      label: "patterns over time",
      title: "patterns over time",
      body: [
        "Patterns are easier to see from a distance. bloom lays the week out as an emotion map: one dot per note, coloured by feeling, from settled to wired.",
        "Underneath: how the week felt, as orbs sized by how much of it each feeling held, and the overarching themes, like “work spilling into evenings”. Observations, never instructions.",
      ],
    },
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["It knew “the onboarding thing” meant Daniel's Slack thread, because Sam chose to let it look."],
  },
  {
    kind: "phone",
    caption: "Settings: each app bloom can read has its own switch. Gmail stays off.",
    src: url("/assets/story/context.mp4"),
    pill: {
      label: "context awareness",
      title: "context awareness",
      body: [
        "bloom reads the calendar, Slack and Notion you connect, so a vague “the onboarding thing” becomes Daniel's request and its Monday deadline. The lamp adds when and where you spoke.",
        "It only reads. It never posts, replies or edits, and each app has its own switch in Settings.",
      ],
    },
  },
  { kind: "big", text: ["Sam puts the phone down.", "The evening is theirs."] },
  { kind: "divider" },
  {
    kind: "line",
    text: ["The next morning, the loose ends are waiting in Sam's week, in the same colours they wear in Google Calendar."],
  },
  {
    kind: "phone",
    caption: "Home eases back as the week slides over it. Faded meetings carry Google Calendar and Notion tags. The tray holds two loose ends.",
    src: url("/assets/story/calendar.mp4"),
    pill: {
      label: "parking loose ends",
      title: "parking loose ends",
      body: [
        "bloom never asks you to plan at night. Loose ends are parked: held somewhere you trust until you're ready for them.",
        "They wear Google Calendar's own colours, Lavender for deep work and Flamingo for replies, so a task looks the same in bloom as in the calendar it syncs to. Imported events stay faded and fixed, so your own thoughts never blur into everyone else's plans.",
      ],
    },
  },
  {
    kind: "line",
    text: ["Sam drags both onto Friday. Anything not worth the energy goes to “Let go”."],
  },
  {
    kind: "phone",
    caption: "A loose end lifts from the tray and follows Sam's finger onto Friday, past the “Let go” bin.",
    src: url("/assets/story/drag.mp4"),
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["bloom suggests when. Sam decides."],
  },
  {
    kind: "phone",
    caption: "Friday: two dashed suggestions, each with a reason. Sam accepts both. Back in the week, each block is as tall as it is long.",
    src: url("/assets/story/day.mp4"),
    pill: {
      label: "full autonomy",
      title: "full autonomy",
      body: [
        "A suggestion stays a dashed outline with its reason, “Longest free stretch before Monday”, until you accept it. Dismiss it, move it, or leave the loose end unscheduled.",
        "Nothing reaches your calendar without your approval, and quiet hours keep bloom silent after work.",
      ],
    },
  },
  { kind: "divider" },
];

export const closing = {
  big: ["bloom holds the day,", "so you can close it."],
  film: "Film — dusk in a small studio. A laptop closes, a hand touches bloom, its petals glow, Sam talks, the light dims, and Sam walks away from the desk.",
  statement: "bloom is a concept by [team names] for DECO3200, 2026.",
  cta: { label: "Try the demo", href: url("/demo") },
  footer: {
    links: [
      { label: "story", href: url("/") },
      { label: "demo", href: url("/demo") },
    ],
    note: "© 2026 bloom · DECO3200",
  },
};
