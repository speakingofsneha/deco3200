// copy for the story site at /. every word on the page lives here.

export interface Pill {
  label: string;
  title: string;
  body: string[];
  refs?: string[];
}

export type Block =
  | { kind: "line"; text: string[] }
  | { kind: "big"; text: string[] }
  | { kind: "phone"; caption: string; src?: string; pill?: Pill }
  | { kind: "photo"; caption: string; src?: string }
  | { kind: "divider" };

export const site = {
  title: "Bloom",
  description: "Bloom is a lamp on your desk and a quiet app on your phone. Talk out the day, and Bloom holds what's left.",
  nav: [
    { label: "Story", href: "#story" },
    { label: "Demo", href: "/demo" },
  ],
  intro: [
    "Bloom is a lamp on your desk and a quiet app on your phone. Talk out the day. Bloom holds what's left, so you can switch off.",
    "Discover Bloom through Sam's evening.",
  ],
};

export const story: Block[] = [
  {
    kind: "line",
    text: ["Sam is a designer who works from a studio flat.", "The desk is three steps from the bed. Nothing marks the end of the day."],
  },
  {
    kind: "photo",
    caption: "Photo — Bloom on Sam's desk at dusk, beside a closed laptop. Its petals glow softly.",
  },
  { kind: "line", text: ["6:42pm. Sam closes the laptop, touches Bloom, and talks."] },
  {
    kind: "phone",
    caption: "GIF — Recording. Bloom's petals open. A peach orb grows with Sam's voice, the timer runs and words drift past. Sam taps stop.",
    pill: {
      label: "Why talk it out",
      title: "Why talk it out",
      body: [
        "Unfinished tasks keep replaying in your head until they have a plan. Making the plan is enough to quiet them, even before anything is done. People who wrote a specific to-do list before bed fell asleep faster than people who wrote about what they'd finished.",
        "Putting a feeling into words calms the brain's alarm response to it. And it doesn't have to be written: talking about a stressful experience out loud has shown benefits at least as strong as writing about it.",
        "Bloom uses both at the moment you're least likely to do either, the end of a long day, when typing feels like more work. You talk. Bloom writes the plan.",
      ],
      refs: [
        "Masicampo & Baumeister (2011), Journal of Personality and Social Psychology",
        "Scullin et al. (2018), Journal of Experimental Psychology: General",
        "Lieberman et al. (2007), Psychological Science",
        "Esterling et al. (1994), Journal of Consulting and Clinical Psychology",
      ],
    },
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["Two minutes of rambling becomes one note.", "The dots inside are the loose ends Bloom heard."],
  },
  {
    kind: "phone",
    caption: "GIF — Home. The new orb settles beside the week's notes and two dots appear inside it. “2 loose ends parked. Nothing urgent before 9am tomorrow.”",
  },
  { kind: "divider" },
  { kind: "line", text: ["Bloom keeps how Sam felt apart from what Sam still has to do."] },
  {
    kind: "phone",
    caption: "GIF — Note. The synthesis reads “Running on other people's agendas”, with the two parked loose ends below. Then the messy transcript.",
    pill: {
      label: "Sorting the mess",
      title: "Sorting the mess",
      body: [
        "An end-of-day ramble mixes feelings, worries and tasks in one breath. Bloom separates them: a short reflection on how the day felt, one question to sit with, and the loose ends lifted out on their own.",
        "It doesn't diagnose or advise. It reflects back what you said, and the full transcript is always one tab away.",
      ],
    },
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["It knew “the onboarding thing” meant Daniel's Slack thread.", "And it says exactly what it read."],
  },
  {
    kind: "phone",
    caption: "GIF — Sources. The note scrolls to its last line: “Read: Google Calendar (today's calls), Slack #acme-review. Nothing else.”",
    pill: {
      label: "Context awareness",
      title: "Context awareness",
      body: [
        "Bloom reads the calendar, Slack and Notion you connect, so a vague “the onboarding thing” becomes Daniel's request and its Monday deadline. The lamp adds when and where you spoke.",
        "It only reads. It never posts, replies or edits. Each source has its own switch, and every note lists what Bloom looked at.",
      ],
    },
  },
  { kind: "big", text: ["Sam puts the phone down.", "The evening is theirs."] },
  { kind: "divider" },
  {
    kind: "line",
    text: ["Next morning, Sam swipes over to the week.", "The two loose ends are waiting in the tray."],
  },
  {
    kind: "phone",
    caption: "GIF — Calendar. Home eases back as the week slides over it. Faded meetings carry Google Calendar and Notion tags. The tray holds two loose ends.",
    pill: {
      label: "Parking loose ends",
      title: "Parking loose ends",
      body: [
        "Bloom never asks you to plan at night. Loose ends are parked: held somewhere you trust until you're ready for them.",
        "They wear Google Calendar's own colours, Lavender for deep work and Flamingo for replies, so a task looks the same in Bloom as in the calendar it syncs to. Imported events stay faded and fixed, so your own thoughts never blur into everyone else's plans.",
      ],
    },
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["Sam drags both onto Friday.", "Anything not worth the energy goes to “Let go”."],
  },
  {
    kind: "phone",
    caption: "GIF — Drag. A loose end lifts from the tray and follows Sam's finger. Friday lights up and a “Let go” bin waits below. “Nothing parked. You're clear.”",
  },
  { kind: "divider" },
  { kind: "line", text: ["Bloom suggests when. Sam decides."] },
  {
    kind: "phone",
    caption: "GIF — Day view. Two dashed suggestions, each with a reason. Sam taps ✓ on both. Back in the week, each block is as tall as it is long.",
    pill: {
      label: "Full autonomy",
      title: "Full autonomy",
      body: [
        "A suggestion stays a dashed outline with its reason, “Longest free stretch before Monday”, until you accept it. Dismiss it, move it, or leave the loose end unscheduled.",
        "Nothing reaches your calendar without your approval, and quiet hours keep Bloom silent after work.",
      ],
    },
  },
  { kind: "divider" },
];

export const closing = {
  big: ["Bloom holds the day,", "so you can close it."],
  film: "Film — dusk in a small studio. A laptop closes, a hand touches Bloom, its petals glow, Sam talks, the light dims, and Sam walks away from the desk.",
  statement: "Bloom is a concept by [team names] for DECO3200, 2026.",
  cta: { label: "Try the demo", href: "/demo" },
  footer: {
    links: [
      { label: "Story", href: "/" },
      { label: "Demo", href: "/demo" },
    ],
    note: "© 2026 Bloom · DECO3200",
  },
};
