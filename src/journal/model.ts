// pure helpers. screens use these to decide what to show.

import { story, type DayId, type LooseEnd } from "../data/story";

export const phoneWidth = 402;
export const phoneHeight = 874;

// home and week live on the swipe track; the rest open over it
export type Screen = "home" | "week" | "note" | "day" | "settings" | "recording" | "patterns";
export type Overlay = Extract<Screen, "note" | "day" | "settings" | "recording" | "patterns">;
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

export function isOverlay(screen: Screen): screen is Overlay {
  return screen === "note" || screen === "day" || screen === "settings" || screen === "recording" || screen === "patterns";
}

// the screen that sits under an overlay
export function baseOf(screen: Screen): "home" | "week" {
  return screen === "week" || screen === "day" ? "week" : "home";
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

export function parkedCount(items: Items, recorded: boolean): number {
  if (!recorded) return 0;
  return story.looseEnds.filter((item) => items[item.id]?.place === "tray").length;
}

// dots on the recorded note follow how many of its loose ends are still parked
export function meetingsDots(items: Items): number {
  return story.looseEnds.filter((item) => item.noteId === "meetings" && items[item.id]?.place === "tray").length;
}

export function trackXFor(screen: Screen): number {
  return baseOf(screen) === "week" ? -phoneWidth : 0;
}

export function weekOrder(item: ItemState, meta: LooseEnd): number {
  const sized = item.place === "fri" && item.suggestion === "accepted";
  return sized ? meta.startMin : 3000 + meta.startMin;
}

// accepted blocks grow with their length; unscheduled ones stay compact
export function weekCardHeight(meta: LooseEnd, scheduled: boolean): number | undefined {
  if (!scheduled) return undefined;
  return Math.max(56, Math.round(meta.durationMin * 0.8));
}

export function dayBlockHeight(meta: LooseEnd): number {
  return meta.durationMin >= 60 ? 196 : 82;
}

export function clockOf(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
