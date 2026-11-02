// copy and sample data for the bloom demo.

export type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
// orb colours come from the design system palette
export type OrbColor = "rose" | "apricot" | "sky" | "sage" | "cream";
// loose ends wear google calendar's event colours, so they match where they sync
export type CalColor = "lavender" | "flamingo" | "sage" | "peacock" | "banana" | "graphite";
export type SourceId = "gcal" | "notion";

export interface HomeNote {
  id: string;
  label: string;
  meta: string;
  // length of the voice memo, in minutes. longer notes draw a larger orb.
  minutes: number;
  // inner and outer colour of the orb's gradient
  colors: [OrbColor, OrbColor];
  // only the recorded note opens; it appears after recording
  recorded?: boolean;
}

// 1 minute sits clearly smaller than the current two-minute orb; longer notes grow from there.
export function orbScale(minutes: number): number {
  const clamped = Math.min(6, Math.max(0.5, minutes));
  return Math.round((0.52 + clamped * 0.24) * 100) / 100;
}

export interface LooseEnd {
  id: string;
  noteId: string;
  title: string;
  color: CalColor;
  category: string;
  durationMin: number;
  clock: string;
  clockEnd?: string;
  // minutes from midnight
  startMin: number;
  fromNine: number;
  time: string;
  reason: string;
}

export interface ImportedEvent {
  id: string;
  title: string;
  dayId: DayId;
  source: SourceId;
  sourceName: string;
  color: CalColor;
  time: string;
  clock: string;
  dayTitle: string;
  fromNine: number;
  durationMin: number;
  order: number;
}

// google calendar's default event colours
export const calColors: Record<CalColor, { name: string; hex: string }> = {
  lavender: { name: "Lavender", hex: "#7986cb" },
  flamingo: { name: "Flamingo", hex: "#e67c73" },
  sage: { name: "Sage", hex: "#33b679" },
  peacock: { name: "Peacock", hex: "#039be5" },
  banana: { name: "Banana", hex: "#f6bf26" },
  graphite: { name: "Graphite", hex: "#616161" },
};

export const story = {
  title: "Bloom",
  statusTime: "6:42",
  restart: "Restart",

  ui: {
    backHome: "Back to Home",
    backWeek: "Back to week",
    openCalendar: "Open calendar",
    openHome: "Back to Home",
    play: "Play voice note",
    pause: "Pause voice note",
    mic: "Talk to Bloom",
    move: "Move…",
    letGo: "Let go",
    undo: "Undo",
    toast: "Let go",
    settings: "Settings",
    suggested: "Suggested",
    unscheduled: "Unscheduled",
    tablist: "Note sections",
    today: "Today",
    swipeHint: "Swipe down or from the left edge to go back",
  },

  home: {
    title: "Home",
    notes: [
      { id: "slow-start", label: "slow start, good finish", meta: "Tue · 2 min", minutes: 2, colors: ["cream", "rose"] },
      { id: "water", label: "run by the water", meta: "Wed · 1 min", minutes: 1, colors: ["sky", "sage"] },
      { id: "meetings", label: "too many meetings", meta: "Thu · 3 min", minutes: 3, colors: ["apricot", "rose"], recorded: true },
    ] satisfies HomeNote[],
    hint: "Tap to talk",
    arrived: "2 loose ends parked. Nothing urgent before 9am tomorrow.",
  },

  recording: {
    title: "Recording",
    listening: "Bloom is listening",
    stop: "Stop recording",
    cancel: "Discard recording",
    sorting: "Sorting what you felt from what's left to do…",
    // words appear as if spoken, a few at a time
    live: "okay so. that was six calls. six. I didn't open Figma once, which is… yeah. the onboarding thing came up again in the Acme call. Daniel's being vague but it needs reworking, probably by Monday? not tonight. oh, and Leah asked about the offsite two days ago and I still haven't replied. ugh. okay. I'm closing the laptop.",
  },

  note: {
    id: "meetings",
    title: "too many meetings",
    duration: "2:38",
    throughline: "2 loose ends parked. Nothing urgent before 9am tomorrow.",
    tabs: [
      { id: "synthesis", label: "AI Synthesis" },
      { id: "transcript", label: "Transcript" },
    ],
    synthesis: {
      heading: "Running on other people's agendas",
      body: "Six calls back to back, and the work you care about kept slipping. You sounded drained, but clear about what matters.",
      supporting: "Two things are still on your mind: the onboarding rework for Daniel, and getting back to Leah. Both are parked. Neither needs you tonight.",
      tags: ["drained", "back-to-back", "clarity"],
      parkedLabel: "Parked",
      sitWithLabel: "Something to sit with",
      sitWith: "Which one call this week could have been a message?",
      sources: "Read: Google Calendar (today's calls), Slack #acme-review. Nothing else.",
    },
    transcript:
      "okay so. that was six calls. six. I didn't open Figma once, which is… yeah. um. the onboarding thing came up again in the Acme call and Daniel's being kind of vague, but basically it needs reworking, probably by Monday? I don't know. I'll look at it properly tomorrow. not tonight. oh, and Leah asked about the offsite like two days ago and I still haven't replied. I keep reading it and then going into another call. ugh. okay. anyway, I'm closing the laptop. that's it.",
  },

  week: {
    title: "Week 45",
    openFriday: "Open Friday, 7 November",
    days: [
      { id: "mon", name: "Mon", date: 3 },
      { id: "tue", name: "Tue", date: 4 },
      { id: "wed", name: "Wed", date: 5 },
      { id: "thu", name: "Thu", date: 6, isToday: true },
      { id: "fri", name: "Fri", date: 7 },
      { id: "sat", name: "Sat", date: 8 },
      { id: "sun", name: "Sun", date: 9 },
    ] as { id: DayId; name: string; date: number; isToday?: boolean }[],
    imported: [
      {
        id: "standup",
        title: "Standup",
        dayId: "fri",
        source: "gcal",
        sourceName: "Google Cal",
        color: "peacock",
        time: "9:30–9:45",
        clock: "9:30",
        dayTitle: "Standup · Fri 9:30",
        fromNine: 30,
        durationMin: 15,
        order: 570,
      },
      {
        id: "crit",
        title: "Design crit",
        dayId: "fri",
        source: "notion",
        sourceName: "Notion",
        color: "graphite",
        time: "4:00–5:00",
        clock: "4pm",
        dayTitle: "Design crit · Fri 4pm",
        fromNine: 420,
        durationMin: 60,
        order: 960,
      },
    ] satisfies ImportedEvent[],
  },

  looseEnds: [
    {
      id: "rework",
      noteId: "meetings",
      title: "Rework onboarding flow",
      color: "lavender",
      category: "Deep work",
      durationMin: 150,
      clock: "10",
      clockEnd: "12:30",
      startMin: 600,
      fromNine: 60,
      time: "10–12:30",
      reason: "Longest free stretch before Monday",
    },
    {
      id: "leah",
      noteId: "meetings",
      title: "Reply to Leah",
      color: "flamingo",
      category: "Replies",
      durationMin: 15,
      clock: "1pm",
      startMin: 780,
      fromNine: 240,
      time: "1–1:15",
      reason: "Quick one, after lunch",
    },
  ] satisfies LooseEnd[],

  moveDays: [
    { id: "thu" as DayId, label: "Thu", aria: "Move to Thursday" },
    { id: "fri" as DayId, label: "Fri", aria: "Move to Friday" },
    { id: "sat" as DayId, label: "Sat", aria: "Move to Saturday" },
  ],

  tray: {
    one: "1 loose end parked",
    clear: "Nothing parked. You're clear.",
    empty: "Nothing parked yet.",
  },

  day: {
    title: "Friday, 7 Nov",
    acceptBoth: "Accept both",
    planned: "Friday's planned. Nothing else needs you.",
  },

  settings: {
    title: "Settings",
    sections: {
      lamp: "Lamp",
      quiet: "Quiet hours",
      context: "Apps",
      colours: "Colours",
      privacy: "Privacy",
    },
    lamp: {
      name: "Bloom · Sam's desk",
      status: "Connected",
      toggles: [
        { id: "glow", label: "Glow when the workday ends", on: true },
        { id: "dim", label: "Dim after a note", on: true },
      ],
    },
    quiet: { label: "No suggestions or reminders", value: "6:30pm – 9am" },
    sources: [
      { id: "gcal", name: "Google Calendar", detail: "Reads events. Adds only what you approve.", on: true },
      { id: "slack", name: "Slack", detail: "Reads channels you choose. Never posts.", on: true },
      { id: "notion", name: "Notion", detail: "Reads pages you choose. Never edits.", on: true },
      { id: "gmail", name: "Gmail", detail: "Off. Bloom can't see your email.", on: false },
    ],
    colours: {
      note: "Bloom uses Google Calendar's colours, so a loose end looks the same in both places.",
      rows: [
        { category: "Deep work", color: "lavender" as CalColor },
        { category: "Replies", color: "flamingo" as CalColor },
        { category: "Personal", color: "sage" as CalColor },
      ],
    },
    privacy: [
      { id: "log", label: "What Bloom read today" },
      { id: "delete", label: "Delete all notes" },
    ],
    restart: "Restart demo",
  },
};

export function parkedLabel(count: number, recorded: boolean): string {
  if (!recorded) return story.tray.empty;
  if (count === 0) return story.tray.clear;
  if (count === 1) return story.tray.one;
  return `${count} loose ends parked`;
}

export function blobLabel(name: string, dots: number): string {
  if (dots === 0) return `${name}, no loose ends`;
  if (dots === 1) return `${name}, 1 loose end`;
  return `${name}, ${dots} loose ends`;
}

export function moveLabel(title: string): string {
  return `Move ${title}`;
}

export function acceptLabel(title: string): string {
  return `Accept ${title}`;
}

export function dismissLabel(title: string): string {
  return `Dismiss ${title}`;
}

export function letGoLabel(title: string): string {
  return `Let go of ${title}`;
}
