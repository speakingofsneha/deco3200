// copy for the story site at /. every word on the page lives here.
// the word "Bloom" is set in the sans wherever it appears in serif copy.

export interface Pill {
  label: string;
  title: string;
  body: string[];
}

export type Block =
  | { kind: "line"; text: string[] }
  | { kind: "big"; text: string[] }
  | { kind: "phone"; caption: string; src?: string; pill?: Pill }
  | { kind: "photo"; caption: string; src?: string }
  | { kind: "divider" };

export const site = {
  title: "Bloom",
  description:
    "Bloom is a calm thought partner that lives on your desk as a flower-shaped lamp.",
  nav: [
    { label: "About", href: "#about" },
    { label: "Prototype", href: "/prototype" },
  ],
  intro: [
    "Bloom is a calm thought partner that lives on your desk as a flower-shaped lamp. It helps you leave work at work, even when work is at home.",
    "Discover Bloom through Sam's story.",
  ],
};

export const story: Block[] = [
  {
    kind: "line",
    text: [
      "Sam is a product designer who works from a small studio.",
      "Their desk is three steps from their bed, and work never quite ends.",
    ],
  },
  {
    kind: "photo",
    caption: "Photo — Bloom on Sam's desk at dusk, beside a closed laptop and a mug. Its petals glow softly.",
  },
  {
    kind: "line",
    text: ["It's 6:42pm. Sam closes the laptop, touches Bloom, and talks."],
  },
  {
    kind: "phone",
    caption:
      "GIF — Recording in the lamp. Bloom's petals open as Sam speaks. A peach blob breathes and grows, 2:38, “Listening… via Bloom”. The petals close and the light dims.",
    pill: {
      label: "Bloom, the lamp",
      title: "Bloom, the lamp",
      body: [
        "When home is also the office, nothing tells your brain the day is over. Bloom is that signal.",
        "Touch it to talk the day out. When its light warms and dims, work is done. There is no screen and no notifications, and it only listens when you touch it.",
      ],
    },
  },
  { kind: "divider" },
  { kind: "line", text: ["The ramble becomes a note."] },
  {
    kind: "phone",
    caption:
      "GIF — Home. The peach blob settles among the week's notes. Two black dots appear, one for each loose end. Label: Too many meetings.",
    pill: {
      label: "Loose ends",
      title: "Loose ends",
      body: [
        "Every dot inside a note is a loose end Bloom noticed: something you said you'd do, or someone you need to get back to.",
        "There are never more than three per note, so one glance tells you how much a day left behind, without opening anything.",
      ],
    },
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["Bloom keeps what Sam felt apart from what Sam still has to do."],
  },
  {
    kind: "phone",
    caption:
      "GIF — Note. “2 loose ends parked. Nothing urgent before 9am tomorrow.” The AI Synthesis tab, then the messy transcript.",
    pill: {
      label: "Sorting the mess",
      title: "Sorting the mess",
      body: [
        "Bloom reflects back how your day felt, in plain language, and quietly lifts out the loose ends so they stop looping in your head.",
        "It only uses the calendar and work tools you connect. It reads, and never posts, replies or edits. Every note shows exactly what it looked at.",
      ],
    },
  },
  { kind: "big", text: ["Sam puts the phone down.", "The evening is theirs."] },
  { kind: "divider" },
  { kind: "line", text: ["The next morning, Sam swipes over to their week."] },
  {
    kind: "phone",
    caption:
      "GIF — Calendar. Home slides away and the week slides in. Imported meetings sit faded and tagged. Sam drags “Rework onboarding flow” and “Reply to Leah” onto Friday, past a “Let go” zone. “Nothing parked. You're clear.”",
    pill: {
      label: "Parked, not pushed",
      title: "Parked, not pushed",
      body: [
        "Last night, Bloom didn't ask Sam to plan anything. It held their loose ends somewhere they trust.",
        "Imported events stay faded and untouchable, so Sam can always tell their own thoughts apart from everything else on the calendar. Anything that doesn't deserve the energy can be dragged to “Let go”.",
      ],
    },
  },
  { kind: "divider" },
  { kind: "line", text: ["Bloom suggests where things could fit. Sam decides."] },
  {
    kind: "phone",
    caption:
      "GIF — Day view. Two dashed suggestions with reasons. Sam taps ✓ on each and they fill with soft colour. Back in the week, Friday's blocks are sized by duration.",
    pill: {
      label: "You decide",
      title: "You decide",
      body: [
        "Bloom never books anything on its own. Every suggestion comes with a reason, and none happens without your approval.",
        "Accept it, dismiss it, or leave the loose end unscheduled. Bloom does the noticing. You make the decisions.",
      ],
    },
  },
  { kind: "divider" },
];

export const closing = {
  big: ["Bloom holds the day,", "so you can close it."],
  film: "Film — dusk in a small studio. A laptop closes, a hand touches Bloom, its petals glow, Sam talks, the light dims, and Sam walks away from the desk.",
  statement: "Bloom is a concept by [team names] for DECO3200, 2026.",
  cta: { label: "Try the prototype", href: "/prototype" },
  footer: {
    links: [
      { label: "Home", href: "/" },
      { label: "Prototype", href: "/prototype" },
    ],
    note: "© 2026 Bloom · DECO3200",
  },
};
