// copy and sample data for the journal demo.

export type DayId = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type Pastel = "rose" | "apricot" | "sky";
export type SourceId = "gcal" | "notion";

export interface HomeNote {
  id: string;
  label: string;
  color: Pastel;
  dots: number;
  opens: boolean;
}

export interface LooseEnd {
  id: string;
  noteId: string;
  title: string;
  color: Pastel;
  durationMin: number;
  clock: string;
  clockEnd?: string;
  // minutes from midnight
  startMin: number;
  // minutes from 9:00, for the day timeline
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
  tint: "sky" | "cream";
  time: string;
  clock: string;
  dayTitle: string;
  fromNine: number;
  durationMin: number;
  // sort key, minutes from midnight
  order: number;
}

export const story = {
  title: "Journal",
  statusTime: "6:42",
  restart: "Restart",

  ui: {
    backHome: "Back to Home",
    backWeek: "Back to week",
    openCalendar: "Open calendar",
    openHome: "Back to Home",
    play: "Play voice note",
    pause: "Pause voice note",
    mic: "Microphone",
    move: "Move…",
    letGo: "Delete",
    undo: "Undo",
    toast: "Deleted",
    settings: "Settings",
    suggested: "Suggested",
    unscheduled: "Unscheduled",
    tablist: "Note sections",
    today: "Today",
  },

  home: {
    title: "Home",
    notes: [
      {
        id: "slow-start",
        label: "slow start, good finish",
        color: "rose",
        dots: 1,
        opens: false,
      },
      {
        id: "meetings",
        label: "Too many meetings",
        color: "apricot",
        dots: 2,
        opens: true,
      },
      {
        id: "water",
        label: "Run by the water",
        color: "sky",
        dots: 0,
        opens: false,
      },
    ] satisfies HomeNote[],
  },

  note: {
    id: "meetings",
    title: "Too many meetings",
    duration: "2:38",
    throughline: "2 loose ends parked. Nothing urgent before 9am tomorrow.",
    tabs: [
      { id: "synthesis", label: "AI Synthesis" },
      { id: "transcript", label: "Transcript" },
    ],
    synthesis: {
      heading: "Finding home in the small things",
      body: "New York feels full of possibility, but you’re tired of feeling like you need to keep up. Beneath the restlessness is a wish to belong — not a wish to leave.",
      supporting:
        "The bodega owner remembering your order felt grounding. So did calling Mom. Those ordinary moments suggest that home might grow through familiar people and small rituals, rather than one big turning point.",
      tags: ["belonging", "small rituals", "slowing down"],
      sitWithLabel: "Something to sit with",
      sitWith: "What’s one small ritual you’d like to make yours here?",
    },
    transcript:
      "okay so. that was six meetings. six. I didn't open Figma once, which is… yeah. um. the onboarding thing came up again in the Acme call and Daniel's being kind of vague, but basically it needs reworking, probably by Monday? I don't know. I'll look at it properly tomorrow. not tonight. oh, and Sam asked about the offsite like two days ago and I still haven't replied. I keep reading it and then going into another call. ugh. okay. anyway, I'm home. I'm putting my phone down. that's it.",
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
        tint: "sky",
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
        tint: "cream",
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
      color: "rose",
      durationMin: 150,
      clock: "10",
      clockEnd: "12:30",
      startMin: 600,
      fromNine: 60,
      time: "10–12:30",
      reason: "Longest free stretch before Monday",
    },
    {
      id: "sam",
      noteId: "meetings",
      title: "Reply to Sam",
      color: "apricot",
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
  },

  day: {
    title: "Friday, 7 Nov",
    acceptBoth: "Accept both",
    planned: "Friday's planned. Nothing else needs you.",
    hours: [
      { label: "9 AM" },
      { label: "10" },
      { label: "11" },
      { label: "12 PM" },
      { label: "1" },
      { label: "2" },
      { label: "3" },
      { label: "4" },
      { label: "5 PM" },
    ],
  },
};

export function parkedLabel(count: number): string {
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
