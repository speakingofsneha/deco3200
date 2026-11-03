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
  title: "Bloom",
  description:
    "Bloom helps people who work from home end the workday. Talk to a lamp on your desk when you're done, and your loose ends wait in your calendar until morning.",
  nav: [
    { label: "About", href: "#story" },
    { label: "Demo", href: url("/demo") },
  ],
  intro: [
    "When you work from home, nothing tells you the workday is over; unfinished tasks follow you into the rest of your evening. Bloom is an intelligent journal you can talk to when your work is done.",
    "Discover Bloom through Sam's evening.",
  ],
};

export const story: Block[] = [
  {
    kind: "line",
    text: [
      "Sam is a designer who works from a studio flat. Her desk is three steps from her bed.",
      "Journaling is one of the most recommended ways to unwind, but a blank page at 7pm feels like another task instead.",
    ],
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["It's 6:42pm. Sam closes the laptop, touches Bloom, and talks. There's no prompts or structure, just a stream of consciousness."],
  },
  {
    kind: "photo",
    caption: "Photo — Bloom on Sam's desk at dusk, next to her closed laptop.",
    src: url("/assets/story/lamprecording.MOV"),
  },
  {
    kind: "line",
    text: ["She can use the app as well, but she prefers to talk the lamp instead."],
  },
  {
    kind: "phone",
    caption: "Recording: an orb grows while Sam talks and her words appear as she says them. She taps stop.",
    src: url("/assets/story/recording.mp4"),
    pill: {
      label: "Why talk it out?",
      title: "Why talk it out?",
      body: [
        "Writing takes energy most people don't have left at the end of a workday. Talking takes almost none, and it works: speaking about a stressful experience has shown benefits at least as strong as writing about it.",
        "Naming a feeling helps too. Putting it into words reduces the brain's alarm response to it.",
      ],
      refs: [
        "Esterling et al. (1994), Journal of Consulting and Clinical Psychology",
        "Lieberman et al. (2007), Psychological Science",
      ],
    },
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["Bloom sorts what Sam said into how she felt, what it was about, and what she still has to do."],
  },
  {
    kind: "phone",
    caption: "Sam's note: her feelings, sized by how much of the note they took up, its themes, and two loose ends. Then the full transcript.",
    src: url("/assets/story/note.mp4"),
    pill: {
      label: "Tagging emotions",
      title: "Tagging emotions",
      body: [
        "Most AI journals reply to you. We didn't want Sam's evening to become another conversation, so Bloom doesn't chat, prompt or give advice. It tags the feelings in what she said and lifts out the tasks from them.",
        "Every note is tagged with the feelings in it, close to the words Sam used. Each feeling has a colour and a size, so a note's orb becomes a quick read of the day.",
      ],
    },
  },
  {
    kind: "line",
    text: ["Each note recorded is saved in the app, for her to look back on."],
  },
  {
    kind: "phone",
    caption: "Home: the new orb lands next to the week's notes, with two dots inside.",
    src: url("/assets/story/arrival.mp4"),
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["People rarely look back on what they've journaled, though most wish they did. Bloom does the looking back, gathering the week into patterns Sam can reflect back on."],
  },
  {
    kind: "phone",
    caption: "This week: one orb per note, plotted by day, then the feelings that took up the week and the themes that kept coming up.",
    src: url("/assets/story/patterns.mp4"),
    pill: {
      label: "Patterns over time",
      title: "Patterns over time",
      body: [
        "Looking back is where journaling pays off, and it's the step most people skip. Bloom plots each note by day and by how wound-up it sounded, then shows which feelings filled the week and which themes kept returning, like “work spilling into evenings”.",
        "It describes what happened. It doesn't tell Sam what to do about it.",
      ],
    },
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["Bloom knew the vague “onboarding thing” meant Daniel's request in Slack, because Sam allowed access to it."],
  },
  {
    kind: "phone",
    caption: "Settings: every app Bloom can read has its own switch. Gmail stays off.",
    src: url("/assets/story/context.mp4"),
    pill: {
      label: "Contextual intelligence",
      title: "Contextual intelligence",
      body: [
        "People talk in shorthand. Context from your calendar, Slack and Notion turns “the onboarding thing” into Daniel's request, due Monday, without you having to explain it.",
        "But you can only trust a tool if you know what it's looking at. Bloom only reads: it never posts, replies or edits. Each app has its own switch, and anything you leave off, like Gmail here, it never sees.",
      ],
    },
  },
  { kind: "big", text: ["Sam puts the phone down.", "The evening is now hers."] },
  { kind: "divider" },
  {
    kind: "line",
    text: ["The next morning, the loose ends from the previous evening are waiting in the app."],
  },
  {
    kind: "phone",
    caption: "Home slides back as the week slides in. Meetings from Google Calendar and Notion are faded. The tray holds two loose ends.",
    src: url("/assets/story/calendar.mp4"),
    pill: {
      label: "Why park tasks?",
      title: "Why park tasks?",
      body: [
        "Unfinished tasks stick in the mind. Psychologists call this the Zeigarnik effect: we keep thinking about what we haven't finished, which is exactly what keeps work running in your head at night.",
        "You don't have to finish a task to let it go. Making a specific plan for it is enough to stop it replaying, and people who wrote down tomorrow's to-dos before bed fell asleep faster than people who didn't.",
        "So Bloom parks loose ends overnight and asks nothing of you until morning. They use Google Calendar's colours so a task looks the same in both places, and imported meetings stay faded so your own tasks stand out.",
      ],
      refs: [
        "Zeigarnik (1927), Psychologische Forschung",
        "Masicampo & Baumeister (2011), Journal of Personality and Social Psychology",
        "Scullin et al. (2018), Journal of Experimental Psychology: General",
      ],
    },
  },
  {
    kind: "line",
    text: ["Sam drags both onto Friday. Anything not worth the energy, she drags to “Let go”."],
  },
  {
    kind: "phone",
    caption: "Sam drags a loose end from the tray onto Friday, past the “Let go” bin.",
    src: url("/assets/story/drag.mp4"),
  },
  { kind: "divider" },
  {
    kind: "line",
    text: ["Bloom suggests a time, and Sam decides."],
  },
  {
    kind: "phone",
    caption: "Friday: two suggested times, each with a reason. Sam accepts both, and each block in the week is as tall as the task is long.",
    src: url("/assets/story/day.mp4"),
    pill: {
      label: "Autonomy",
      title: "Autonomy",
      body: [
        "Bloom never decides anything on its own, a suggestion stays a dashed outline with its reason, “Longest free stretch before Monday”, until Sam accepts it. She can dismiss it, move it, or leave the task unscheduled.",
        "It also stays out of the way: no notifications, nothing during quiet hours, and no streaks to keep up.",
      ],
    },
  },
];

export const closing = {
  big: ["The workday ends", "when you say it does."],
  statement: "Bloom is a concept by cameron, jessie, jovey and sneha for deco3200",
  cta: { label: "Try the demo", href: url("/demo") },
  footer: {
    links: [
      { label: "About", href: url("/") },
      { label: "Demo", href: url("/demo") },
    ],
    note: "© 2026 Bloom · DECO3200",
  },
};