// pure helpers. screens use these to decide what to show.

import {
  story,
  type DayId,
  type LooseEnd,
} from "../data/story";

export const phoneWidth = 402;

export type Screen = "home" | "note" | "week" | "day";
export type Place = "tray" | DayId | "gone";
export type Suggestion = "pending" | "accepted" | "dismissed";

export interface ItemState {
  place: Place;
  suggestion: Suggestion;
}

export type Items = Record<string, ItemState>;

const dayIds = new Set<string>(story.week.days.map((day) => day.id));

export function isDayId(value: string): value is DayId {
  return dayIds.has(value);
}

export function freshItems(): Items {
  return Object.fromEntries(
    story.looseEnds.map((item) => [item.id, { place: "tray" as Place, suggestion: "pending" as Suggestion }]),
  );
}

export function looseEnd(id: string): LooseEnd {
  const item = story.looseEnds.find((entry) => entry.id === id);
  if (!item) throw new Error(`unknown loose end ${id}`);
  return item;
}

export function parkedCount(items: Items): number {
  return story.looseEnds.filter((item) => items[item.id]?.place === "tray").length;
}

// dots on the meetings blob follow how many of its loose ends are still parked
export function meetingsDots(items: Items): number {
  return story.looseEnds.filter((item) => item.noteId === "meetings" && items[item.id]?.place === "tray").length;
}

export function trackXFor(screen: Screen): number {
  return screen === "week" || screen === "day" ? -phoneWidth : 0;
}

export function weekOrder(item: ItemState, meta: LooseEnd): number {
  const sized = item.place === "fri" && item.suggestion === "accepted";
  return sized ? meta.startMin : 3000 + meta.startMin;
}

export function weekCardHeight(meta: LooseEnd): number {
  return meta.durationMin >= 60 ? 100 : 46;
}

export function dayBlockHeight(meta: LooseEnd): number {
  return meta.durationMin >= 60 ? 196 : 82;
}
