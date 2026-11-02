// copy for the story site at /. every word on the page lives here.

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
    { label: "demo", href: "/demo" },
  ],
  intro: [
    "bloom is a journal you talk to at the end of the workday. A lamp on your desk listens to your stream of consciousness, and a quiet app reflects it back: how you felt, what keeps coming up, and what's left to do.",
    "Discover bloom through Sam's evening.",
  ],
};

export const story: Block[] = [
  {
    kind: "line",
    label: "the problem",
    text: [
      "Sam is a designer who works from a studio flat. The desk is three steps from the bed, and the workday never quite ends.",
      "Journaling might help. But a blank page at 7pm feels like one more task.",
    ],
  },
  {
    kind: "photo",
    caption: "Photo — bloom on Sam's desk at dusk, beside a closed laptop. Its petals glow softly.",
  },
  {
    kind: "line",
    label: "talking it out",
    text: ["6:42pm. Sam closes the laptop, touches bloom, and talks. No prompts, no structure, no blank page. Just a stream of consciousness."],
  },
  {
    kind: "phone",
    caption: "GIF — Recording. bloom's petals open. A peach orb grows with Sam's voice, the timer runs and words drift past. Sam taps stop.",
    pill: {
      label: "why talk it out",
      title: "why talk it out",
      body: [
        "Stream-of-consciousness journaling works because you don't have to organise anything first. But writing takes energy that's gone by the end of a long day. Speaking doesn't.",
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
    label: "reflection, not response",
    text: ["bloom doesn't reply. It reflects: the feelings in what Sam said, the themes underneath, and the loose ends."],
  },
  {
    kind: "phone",
    caption: "GIF — Note. Feelings tagged “tense”, “drained”, “clear”, each in its own colour. A line in Sam's words, the themes, two loose ends, and the threads back to earlier notes.",
    pill: {
      label: "emotion tagging",
      title: "emotion tagging",
      body: [
        "Every note is tagged with the feelings in it, close to the words Sam used. Each feeling has a colour, so a note's orb becomes a quick read of the day: apricot for clarity, rose for tension.",
        "The tags are suggestions. Tap one to change it. There's no chat and no advice. bloom holds up a mirror; it doesn't answer back.",
      ],
    },
  },
  {
    kind: "line",
    text: ["The colour of each orb is how the day felt. The dots are what's still open."],
  },
  {
    kind: "phone",
    caption: "GIF — Home. The new orb settles beside the week's notes and two dots appear inside it. “2 loose ends parked. Nothing urgent before 9am tomorrow.”",
  },
  { kind: "divider" },
  {
    kind: "line",
    label: "patterns over time",
    text: ["Looking back is where journaling pays off, and the part most people skip. bloom gathers the week so Sam doesn't have to reread a thing."],
  },
  {
    kind: "phone",
    caption: "GIF — This week. An emotion map with one dot per note. How the week felt, in colour. Overarching themes, continuous threads and new directions.",
    pill: {
      label: "patterns over time",
      title: "patterns over time",
      body: [
        "Patterns are easier to see from a distance. bloom lays the week out as an emotion map: one dot per note, coloured by feeling, from settled to wired.",
        "Underneath sit the overarching themes, the threads that keep coming back (“the onboarding rework keeps coming back”), and new directions worth noticing (“evenings after a run read calmer”). Observations, never instructions.",
      ],
    },
  },
  { kind: "divider" },
  {
    kind: "line",
    label: "context, with consent",
    text: ["It knew “the onboarding thing” meant Daniel's Slack thread, and it says exactly what it read."],
  },
  {
    kind: "phone",
    caption: "GIF — Sources. The note scrolls to its last line: “Read: Google Calendar (today's calls), Slack #acme-review. Nothing else.”",
    pill: {
      label: "context awareness",
      title: "context awareness",
      body: [
        "bloom reads the calendar, Slack and Notion you connect, so a vague “the onboarding thing” becomes Daniel's request and its Monday deadline. The lamp adds when and where you spoke.",
        "It only reads. It never posts, replies or edits. Each source has its own switch, and every note lists what bloom looked at.",
      ],
    },
  },
  { kind: "big", text: ["Sam puts the phone down.", "The evening is theirs."] },
  { kind: "divider" },
  {
    kind: "line",
    label: "loose ends",
    text: ["Next morning, Sam swipes over to the week. Two loose ends wait in the tray, in Google Calendar's colours."],
  },
  {
    kind: "phone",
    caption: "GIF — Calendar. Home eases back as the week slides over it. Faded meetings carry Google Calendar and Notion tags. The tray holds two loose ends.",
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
    caption: "GIF — Drag. A loose end lifts from the tray and follows Sam's finger. Friday lights up and a “Let go” bin waits below. “Nothing parked. You're clear.”",
  },
  { kind: "divider" },
  {
    kind: "line",
    label: "you decide",
    text: ["bloom suggests when. Sam decides."],
  },
  {
    kind: "phone",
    caption: "GIF — Day view. Two dashed suggestions, each with a reason. Sam taps ✓ on both. Back in the week, each block is as tall as it is long.",
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
  cta: { label: "Try the demo", href: "/demo" },
  footer: {
    links: [
      { label: "story", href: "/" },
      { label: "demo", href: "/demo" },
    ],
    note: "© 2026 bloom · DECO3200",
  },
};
