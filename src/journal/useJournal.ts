// journal state lives here.
// screens read `state` and call `actions`.
// swipes, edge-swipes, pull-to-dismiss and dragging stay in this file because they follow the pointer.

import { useEffect, useRef, useState, type RefObject } from "react";
import { story, type DayId } from "../data/story";
import {
  baseOf,
  freshItems,
  isDayId,
  isOverlay,
  phoneWidth,
  trackXFor,
  type ItemState,
  type Items,
  type Screen,
} from "./model";

export interface DragVisual {
  id: string;
  active: boolean;
  x: number;
  y: number;
  hotDay: string | null;
  overBin: boolean;
}

export interface Point {
  x: number;
  y: number;
}

export interface JournalState {
  screen: Screen;
  items: Items;
  recorded: boolean;
  arrived: boolean;
  recPhase: "idle" | "listening" | "sorting";
  recSeconds: number;
  settings: Record<string, boolean>;
  playing: boolean;
  tab: string;
  menuId: string | null;
  toast: boolean;
  drag: DragVisual | null;
  trackX: number;
  trackLive: boolean;
  // where the open overlay grew from, in phone px
  origin: Point;
  // live offset while an overlay is being swiped away
  pull: Point | null;
  ready: boolean;
}

export interface JournalActions {
  restart: () => void;
  openNote: (from?: Element | null) => void;
  openWeek: () => void;
  openHome: () => void;
  openDay: (from?: Element | null) => void;
  openSettings: (from?: Element | null) => void;
  openPatterns: (from?: Element | null) => void;
  openRecording: (from?: Element | null) => void;
  stopRecording: () => void;
  close: () => void;
  toggleSetting: (id: string) => void;
  togglePlay: () => void;
  selectTab: (id: string) => void;
  accept: (id: string) => void;
  dismiss: (id: string) => void;
  acceptAll: () => void;
  undo: () => void;
  toggleMenu: (id: string) => void;
  chooseMove: (id: string, dest: string) => void;
}

interface Gesture {
  pointer: number;
  x: number;
  y: number;
  t: number;
  // recent samples for flick velocity
  lastX: number;
  lastY: number;
  lastT: number;
  vx: number;
  vy: number;
  origin: number;
  kind: "track" | "edge" | "pull";
  mode: "undecided" | "live" | "ignore";
}

interface DragGesture {
  id: string;
  pointer: number;
  x: number;
  y: number;
  active: boolean;
}

function freshSettings(): Record<string, boolean> {
  const entries: [string, boolean][] = [
    ...story.settings.lamp.toggles.map((t) => [t.id, t.on] as [string, boolean]),
    ...story.settings.sources.map((s) => [s.id, s.on] as [string, boolean]),
  ];
  return Object.fromEntries(entries);
}

const initialState: JournalState = {
  screen: "home",
  items: freshItems(),
  recorded: false,
  arrived: false,
  recPhase: "idle",
  recSeconds: 0,
  settings: freshSettings(),
  playing: false,
  tab: "synthesis",
  menuId: null,
  toast: false,
  drag: null,
  trackX: 0,
  trackLive: false,
  origin: { x: 201, y: 437 },
  pull: null,
  ready: false,
};

function focusSoon(id: string) {
  requestAnimationFrame(() => {
    document.getElementById(id)?.focus({ preventScroll: true });
  });
}

function scaleOf(phone: HTMLElement): number {
  const width = phone.getBoundingClientRect().width;
  return width > 0 ? width / phoneWidth : 1;
}

// centre of an element, in phone px
function originOf(phone: HTMLElement | null, el: Element | null | undefined): Point | null {
  if (!phone || !el) return null;
  const p = phone.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const s = scaleOf(phone);
  return { x: (r.left + r.width / 2 - p.left) / s, y: (r.top + r.height / 2 - p.top) / s };
}

// which day column is under the pointer, ignoring the parked tray
function columnAt(x: number, y: number): HTMLElement | null {
  const tray = document.getElementById("tray")?.getBoundingClientRect();
  const scroller = document.getElementById("day-scroller")?.getBoundingClientRect();
  if (!tray || !scroller) return null;
  const columns = document.querySelectorAll<HTMLElement>(".day-col");
  for (const column of columns) {
    const rect = column.getBoundingClientRect();
    const left = Math.max(rect.left, scroller.left);
    const right = Math.min(rect.right, scroller.right);
    const top = Math.max(rect.top, scroller.top);
    const bottom = Math.min(rect.bottom, tray.top - 8);
    if (right - left < 20 || bottom - top < 20) continue;
    if (x >= left && x <= right && y >= top && y <= bottom) return column;
  }
  return null;
}

function pointerOverBin(x: number, y: number): boolean {
  const pill = document.querySelector<HTMLElement>(".letgo-pill");
  if (!pill) return false;
  const rect = pill.getBoundingClientRect();
  return x >= rect.left - 12 && x <= rect.right + 12 && y >= rect.top - 12 && y <= rect.bottom + 12;
}

function resetScroll(phone: HTMLElement) {
  const scroller = phone.querySelector<HTMLElement>("#day-scroller");
  const thursday = scroller?.querySelector<HTMLElement>('[data-day="thu"]');
  if (scroller && thursday) {
    const sunday = scroller.querySelector<HTMLElement>('[data-day="sun"]');
    const inset = 24;
    let left = Math.max(0, thursday.offsetLeft - inset);
    if (sunday && left + scroller.clientWidth > sunday.offsetLeft) {
      left = Math.max(0, sunday.offsetLeft - scroller.clientWidth);
    }
    scroller.scrollLeft = left;
  }
  for (const id of ["note-scroll", "day-scroll", "settings-scroll", "patterns-scroll"]) {
    const el = phone.querySelector<HTMLElement>(`#${id}`);
    if (el) el.scrollTop = 0;
  }
}

const titleFor: Record<Screen, string> = {
  home: "home-title",
  week: "week-title",
  note: "note-title",
  day: "day-title",
  settings: "settings-title",
  patterns: "patterns-title",
  recording: "rec-title",
};

export function useJournal(phoneRef: RefObject<HTMLDivElement | null>) {
  const [state, setState] = useState<JournalState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const undoRef = useRef<string[]>([]);
  const toastTimer = useRef(0);
  const arriveTimer = useRef(0);
  const sortTimer = useRef(0);
  const returnFocus = useRef<HTMLElement | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const dragRef = useRef<DragGesture | null>(null);
  const suppressClick = useRef(false);
  const updateRef = useRef<(patch: Partial<JournalState>) => void>(() => {});
  const closeRef = useRef<() => void>(() => {});

  function update(patch: Partial<JournalState>) {
    const next = { ...stateRef.current, ...patch };
    stateRef.current = next;
    setState(next);
  }
  updateRef.current = update;

  function armToast() {
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => {
      undoRef.current = [];
      const toast = document.getElementById("toast");
      if (toast?.contains(document.activeElement)) focusSoon(titleFor[stateRef.current.screen]);
      updateRef.current({ toast: false });
    }, 5000);
  }

  function hideToast(focusFallback: boolean) {
    window.clearTimeout(toastTimer.current);
    const toast = document.getElementById("toast");
    if (focusFallback && toast?.contains(document.activeElement)) focusSoon(titleFor[stateRef.current.screen]);
    update({ toast: false });
  }

  function go(screen: Screen, extra: Partial<JournalState> = {}) {
    update({ screen, menuId: null, trackX: trackXFor(screen), trackLive: false, pull: null, ...extra });
    focusSoon(titleFor[screen]);
  }

  function openOverlay(screen: Screen, from?: Element | null, extra: Partial<JournalState> = {}) {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const origin = originOf(phoneRef.current, from) ?? stateRef.current.origin;
    go(screen, { origin, ...extra });
  }

  function setItem(id: string, next: ItemState, extra: Partial<JournalState> = {}) {
    update({ ...extra, items: { ...stateRef.current.items, [id]: next } });
  }

  function finishRecording() {
    window.clearTimeout(sortTimer.current);
    update({ recPhase: "sorting" });
    sortTimer.current = window.setTimeout(() => {
      go("home", { recPhase: "idle", recorded: true, arrived: true });
      window.clearTimeout(arriveTimer.current);
      arriveTimer.current = window.setTimeout(() => updateRef.current({ arrived: false }), 5200);
    }, 1800);
  }

  const actions: JournalActions = {
    restart() {
      undoRef.current = [];
      window.clearTimeout(toastTimer.current);
      window.clearTimeout(arriveTimer.current);
      window.clearTimeout(sortTimer.current);
      dragRef.current = null;
      gesture.current = null;
      update({ ...initialState, ready: true });
      const phone = phoneRef.current;
      if (phone) resetScroll(phone);
      focusSoon("home-title");
    },
    openNote(from) {
      openOverlay("note", from);
    },
    openWeek() {
      go("week");
    },
    openHome() {
      go("home");
    },
    openDay(from) {
      openOverlay("day", from);
    },
    openSettings(from) {
      openOverlay("settings", from);
    },
    openPatterns(from) {
      openOverlay("patterns", from);
    },
    openRecording(from) {
      openOverlay("recording", from, { recPhase: "listening", recSeconds: 0 });
    },
    stopRecording() {
      if (stateRef.current.recPhase !== "listening") return;
      finishRecording();
    },
    close() {
      const screen = stateRef.current.screen;
      if (!isOverlay(screen)) return;
      if (screen === "recording") {
        window.clearTimeout(sortTimer.current);
        go("home", { recPhase: "idle", recSeconds: 0 });
        return;
      }
      go(baseOf(screen));
      const back = returnFocus.current;
      if (back) requestAnimationFrame(() => back.focus({ preventScroll: true }));
    },
    toggleSetting(id) {
      const settings = stateRef.current.settings;
      update({ settings: { ...settings, [id]: !settings[id] } });
    },
    togglePlay() {
      update({ playing: !stateRef.current.playing });
    },
    selectTab(id) {
      update({ tab: id });
    },
    accept(id) {
      const item = stateRef.current.items[id];
      if (!item || item.place !== "fri") return;
      setItem(id, { ...item, suggestion: "accepted" });
    },
    dismiss(id) {
      const item = stateRef.current.items[id];
      if (!item || item.place !== "fri") return;
      setItem(id, { ...item, suggestion: "dismissed" });
      if (document.activeElement instanceof HTMLElement && document.activeElement.dataset.dismiss === id) {
        focusSoon("day-title");
      }
    },
    acceptAll() {
      const items = { ...stateRef.current.items };
      for (const meta of story.looseEnds) {
        const item = items[meta.id];
        if (item?.place === "fri" && item.suggestion === "pending") items[meta.id] = { ...item, suggestion: "accepted" };
      }
      update({ items });
    },
    undo() {
      const id = undoRef.current.pop();
      if (!id || !stateRef.current.items[id]) {
        hideToast(true);
        return;
      }
      setItem(id, { place: "tray", suggestion: "pending" });
      if (undoRef.current.length === 0) hideToast(false);
      else {
        updateRef.current({ toast: true });
        armToast();
      }
    },
    toggleMenu(id) {
      if (stateRef.current.menuId === id) {
        update({ menuId: null });
        document.getElementById(`move-${id}`)?.focus();
        return;
      }
      update({ menuId: id });
    },
    chooseMove(id, dest) {
      update({ menuId: null });
      const item = stateRef.current.items[id];
      if (!item) return;
      if (dest === "letgo") {
        undoRef.current.push(id);
        setItem(id, { place: "gone", suggestion: "pending" }, { toast: true, menuId: null });
        armToast();
        return;
      }
      if (!isDayId(dest)) return;
      setItem(id, { place: dest as DayId, suggestion: "pending" }, { menuId: null });
    },
  };
  closeRef.current = actions.close;

  // the recording clock
  useEffect(() => {
    if (state.recPhase !== "listening") return;
    const timer = window.setInterval(() => {
      updateRef.current({ recSeconds: stateRef.current.recSeconds + 1 });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [state.recPhase]);

  useEffect(() => {
    const node = phoneRef.current;
    if (!node) return;
    const phone: HTMLDivElement = node;
    const write = (patch: Partial<JournalState>) => updateRef.current(patch);

    function local(event: PointerEvent): Point {
      const r = phone.getBoundingClientRect();
      const s = scaleOf(phone);
      return { x: (event.clientX - r.left) / s, y: (event.clientY - r.top) / s };
    }

    function startGesture(event: PointerEvent, kind: Gesture["kind"]) {
      const now = performance.now();
      gesture.current = {
        pointer: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        t: now,
        lastX: event.clientX,
        lastY: event.clientY,
        lastT: now,
        vx: 0,
        vy: 0,
        origin: trackXFor(stateRef.current.screen),
        kind,
        mode: "undecided",
      };
    }

    function beginGesture(event: PointerEvent) {
      if (dragRef.current || event.button > 0) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      const screen = stateRef.current.screen;
      const at = local(event);

      if (isOverlay(screen)) {
        if (screen === "recording" && stateRef.current.recPhase !== "listening") return;
        if (!target.closest(".overlay.is-open")) return;
        // left edge swipes back, like iOS. pulling down from the header dismisses.
        if (at.x < 32) startGesture(event, "edge");
        else if (screen === "recording" || target.closest(".screen-head, .grabber")) startGesture(event, "pull");
        return;
      }

      if (target.closest(".tray, [role='menu'], .mic, .settings, .patterns-pill")) return;
      if (screen === "week" && at.x > 32 && !target.closest(".week-head, [data-open-home]")) return;
      startGesture(event, "track");
    }

    function moveGesture(event: PointerEvent) {
      const g = gesture.current;
      if (!g || event.pointerId !== g.pointer) return;
      const s = scaleOf(phone);
      const now = performance.now();
      const dt = Math.max(1, now - g.lastT);
      g.vx = ((event.clientX - g.lastX) / s / dt) * 0.6 + g.vx * 0.4;
      g.vy = ((event.clientY - g.lastY) / s / dt) * 0.6 + g.vy * 0.4;
      g.lastX = event.clientX;
      g.lastY = event.clientY;
      g.lastT = now;
      const dx = (event.clientX - g.x) / s;
      const dy = (event.clientY - g.y) / s;

      if (g.mode === "undecided") {
        if (Math.hypot(dx, dy) < 8) return;
        const horizontal = Math.abs(dx) > Math.abs(dy);
        if (g.kind === "track") g.mode = horizontal ? "live" : "ignore";
        else if (g.kind === "edge") g.mode = horizontal && dx > 0 ? "live" : "ignore";
        else g.mode = !horizontal && dy > 0 ? "live" : "ignore";
        if (g.mode === "live") {
          try {
            phone.setPointerCapture(event.pointerId);
          } catch {
            // pointer already released
          }
        }
      }
      if (g.mode !== "live") return;

      if (g.kind === "track") {
        let x = g.origin + dx;
        // rubber band past either end
        if (x > 0) x = x * 0.25;
        if (x < -phoneWidth) x = -phoneWidth + (x + phoneWidth) * 0.25;
        write({ trackX: x, trackLive: true });
      } else if (g.kind === "edge") {
        write({ pull: { x: Math.max(0, dx), y: 0 } });
      } else {
        write({ pull: { x: 0, y: Math.max(0, dy) } });
      }
    }

    function endGesture(event: PointerEvent, cancelled = false) {
      const g = gesture.current;
      if (!g || event.pointerId !== g.pointer) return;
      gesture.current = null;
      if (g.mode !== "live") return;
      suppressClick.current = true;
      const dx = (event.clientX - g.x) / scaleOf(phone);
      const dy = (event.clientY - g.y) / scaleOf(phone);

      if (g.kind === "track") {
        const x = Math.min(0, Math.max(-phoneWidth, g.origin + dx));
        let screen: "home" | "week" = g.origin < 0 ? "week" : "home";
        if (!cancelled) {
          if (g.vx < -0.45) screen = "week";
          else if (g.vx > 0.45) screen = "home";
          else if (Math.abs(x - g.origin) / phoneWidth > 0.35) screen = x < g.origin ? "week" : "home";
        }
        requestAnimationFrame(() => {
          write({ screen, trackX: trackXFor(screen), trackLive: false, menuId: null });
          focusSoon(titleFor[screen]);
        });
        return;
      }

      const far = g.kind === "edge" ? dx > 120 || g.vx > 0.5 : dy > 140 || g.vy > 0.55;
      if (far && !cancelled) closeRef.current();
      else write({ pull: null });
    }

    function beginDrag(event: PointerEvent, row: HTMLElement) {
      if (event.button !== 0) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("button")) return;
      const id = row.dataset.chip;
      if (!id || stateRef.current.items[id]?.place !== "tray") return;
      write({ menuId: null });
      dragRef.current = { id, pointer: event.pointerId, x: event.clientX, y: event.clientY, active: false };
      try {
        row.setPointerCapture(event.pointerId);
      } catch {
        // pointer already released
      }
    }

    function moveDrag(event: PointerEvent) {
      const current = dragRef.current;
      if (!current || event.pointerId !== current.pointer) return;
      if (!current.active) {
        if (Math.hypot(event.clientX - current.x, event.clientY - current.y) < 6) return;
        current.active = true;
      }
      const at = local(event);
      const overBin = pointerOverBin(event.clientX, event.clientY);
      const column = overBin ? null : columnAt(event.clientX, event.clientY);
      write({ drag: { id: current.id, active: true, x: at.x, y: at.y, hotDay: column?.dataset.day ?? null, overBin } });
    }

    function endDrag(commit: boolean, x = 0, y = 0) {
      const current = dragRef.current;
      if (!current) return;
      dragRef.current = null;
      if (!commit || !current.active) {
        write({ drag: null });
        return;
      }
      suppressClick.current = true;
      const id = current.id;
      const dropping = pointerOverBin(x, y);
      const day = dropping ? null : columnAt(x, y)?.dataset.day;
      const item = stateRef.current.items[id];
      if (!item) {
        write({ drag: null });
        return;
      }
      if (dropping) {
        undoRef.current.push(id);
        write({ items: { ...stateRef.current.items, [id]: { place: "gone", suggestion: "pending" } }, toast: true, drag: null });
        armToast();
        return;
      }
      if (day && isDayId(day)) {
        write({ items: { ...stateRef.current.items, [id]: { place: day, suggestion: "pending" } }, drag: null });
        return;
      }
      write({ drag: null });
    }

    const onDown = (event: PointerEvent) => {
      // a fresh press should never inherit the last gesture's click guard
      suppressClick.current = false;
      const target = event.target instanceof Element ? event.target : null;
      const row = target?.closest<HTMLElement>("[data-chip]");
      if (row && stateRef.current.screen === "week") beginDrag(event, row);
      else beginGesture(event);
    };
    const onMove = (event: PointerEvent) => {
      moveDrag(event);
      moveGesture(event);
    };
    const onUp = (event: PointerEvent) => {
      if (dragRef.current?.pointer === event.pointerId) endDrag(true, event.clientX, event.clientY);
      endGesture(event);
    };
    const onCancel = (event: PointerEvent) => {
      if (dragRef.current?.pointer === event.pointerId) endDrag(false);
      endGesture(event, true);
    };
    const onClick = (event: MouseEvent) => {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      event.preventDefault();
      event.stopPropagation();
    };
    const onMenu = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("[data-chip]")) event.preventDefault();
    };
    const onDocDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      if (!target || target.closest(".menu, .move-btn")) return;
      if (stateRef.current.menuId) write({ menuId: null });
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (dragRef.current) {
          endDrag(false);
          return;
        }
        const menuId = stateRef.current.menuId;
        if (menuId) {
          write({ menuId: null });
          document.getElementById(`move-${menuId}`)?.focus();
          return;
        }
        if (isOverlay(stateRef.current.screen)) closeRef.current();
        return;
      }
      const target = event.target instanceof HTMLElement ? event.target : null;
      if (!target) return;
      if (target.getAttribute("role") === "tab" && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
        const tabs = [...phone.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
        const index = tabs.indexOf(target as HTMLButtonElement);
        if (index < 0) return;
        event.preventDefault();
        const next = event.key === "ArrowRight" ? (index + 1) % tabs.length : (index - 1 + tabs.length) % tabs.length;
        const tab = tabs[next];
        if (!tab?.dataset.tab) return;
        write({ tab: tab.dataset.tab });
        tab.focus();
        return;
      }
      const menu = target.closest<HTMLElement>('[role="menu"]');
      if (!menu) return;
      const items = [...menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]')];
      const index = items.indexOf(target as HTMLButtonElement);
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const next = event.key === "ArrowDown" ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
        items[next]?.focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        items[0]?.focus();
      } else if (event.key === "End") {
        event.preventDefault();
        items[items.length - 1]?.focus();
      } else if (event.key === "Tab") {
        event.preventDefault();
        const id = menu.id.replace("menu-", "");
        write({ menuId: null });
        document.getElementById(`move-${id}`)?.focus();
      }
    };

    // mouse users can drag the week sideways; touch scrolls natively
    const scroller = phone.querySelector<HTMLElement>("#day-scroller");
    let scrollDrag: { pointer: number; x: number; left: number; moved: boolean } | null = null;
    const onScrollDown = (event: PointerEvent) => {
      if (!scroller || event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("button")) return;
      if (local(event).x < 32) return;
      scrollDrag = { pointer: event.pointerId, x: event.clientX, left: scroller.scrollLeft, moved: false };
      scroller.setPointerCapture(event.pointerId);
    };
    const onScrollMove = (event: PointerEvent) => {
      if (!scroller || !scrollDrag || event.pointerId !== scrollDrag.pointer) return;
      const dx = event.clientX - scrollDrag.x;
      if (Math.abs(dx) > 4) scrollDrag.moved = true;
      scroller.scrollLeft = scrollDrag.left - dx;
    };
    const onScrollEnd = (event: PointerEvent) => {
      if (!scrollDrag || event.pointerId !== scrollDrag.pointer) return;
      if (scrollDrag.moved) suppressClick.current = true;
      scrollDrag = null;
    };

    phone.addEventListener("pointerdown", onDown);
    phone.addEventListener("pointermove", onMove);
    phone.addEventListener("pointerup", onUp);
    phone.addEventListener("pointercancel", onCancel);
    phone.addEventListener("click", onClick, true);
    phone.addEventListener("contextmenu", onMenu);
    document.addEventListener("pointerdown", onDocDown);
    document.addEventListener("keydown", onKey);
    scroller?.addEventListener("pointerdown", onScrollDown);
    scroller?.addEventListener("pointermove", onScrollMove);
    scroller?.addEventListener("pointerup", onScrollEnd);
    scroller?.addEventListener("pointercancel", onScrollEnd);

    resetScroll(phone);
    write({ ready: true });

    return () => {
      phone.removeEventListener("pointerdown", onDown);
      phone.removeEventListener("pointermove", onMove);
      phone.removeEventListener("pointerup", onUp);
      phone.removeEventListener("pointercancel", onCancel);
      phone.removeEventListener("click", onClick, true);
      phone.removeEventListener("contextmenu", onMenu);
      document.removeEventListener("pointerdown", onDocDown);
      document.removeEventListener("keydown", onKey);
      scroller?.removeEventListener("pointerdown", onScrollDown);
      scroller?.removeEventListener("pointermove", onScrollMove);
      scroller?.removeEventListener("pointerup", onScrollEnd);
      scroller?.removeEventListener("pointercancel", onScrollEnd);
      window.clearTimeout(toastTimer.current);
      window.clearTimeout(arriveTimer.current);
      window.clearTimeout(sortTimer.current);
    };
  }, [phoneRef]);

  // focus the first menu item once it is open
  useEffect(() => {
    if (!state.menuId) return;
    document.querySelector<HTMLButtonElement>(`#menu-${state.menuId} [role="menuitem"]`)?.focus();
  }, [state.menuId]);

  return { state, actions };
}
