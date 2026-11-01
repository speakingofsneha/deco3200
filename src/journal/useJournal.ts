// journal state lives here.
// screens read `state` and call `actions`.
// dragging and swiping stay in this file because they follow the pointer.

import { useEffect, useRef, useState, type RefObject } from "react";
import { story, type DayId } from "../data/story";
import {
  freshItems,
  isDayId,
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

export interface JournalState {
  screen: Screen;
  items: Items;
  playing: boolean;
  tab: string;
  menuId: string | null;
  toast: boolean;
  pulse: number;
  drag: DragVisual | null;
  trackX: number;
  trackLive: boolean;
  ready: boolean;
}

export interface JournalActions {
  restart: () => void;
  openNote: () => void;
  openWeek: () => void;
  openHome: () => void;
  openDay: () => void;
  backFromNote: () => void;
  backFromDay: () => void;
  pulseMic: () => void;
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
  origin: number;
  mode: "undecided" | "swipe" | "ignore";
}

interface DragGesture {
  id: string;
  pointer: number;
  x: number;
  y: number;
  active: boolean;
}

const initialState: JournalState = {
  screen: "home",
  items: freshItems(),
  playing: false,
  tab: "synthesis",
  menuId: null,
  toast: false,
  pulse: 0,
  drag: null,
  trackX: 0,
  trackLive: false,
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
  return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
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
  const note = phone.querySelector<HTMLElement>("#note-scroll");
  const day = phone.querySelector<HTMLElement>("#day-scroll");
  if (note) note.scrollTop = 0;
  if (day) day.scrollTop = 0;
}

export function useJournal(phoneRef: RefObject<HTMLDivElement | null>) {
  const [state, setState] = useState<JournalState>(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const undoRef = useRef<string[]>([]);
  const toastTimer = useRef(0);
  const returnFocus = useRef<HTMLElement | null>(null);
  const gesture = useRef<Gesture | null>(null);
  const dragRef = useRef<DragGesture | null>(null);
  const suppressClick = useRef(false);
  const updateRef = useRef<(patch: Partial<JournalState>) => void>(() => {});

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
      if (toast?.contains(document.activeElement)) {
        const screen = stateRef.current.screen;
        focusSoon(screen === "day" ? "day-title" : "week-title");
      }
      updateRef.current({ toast: false });
    }, 5000);
  }

  function hideToast(focusFallback: boolean) {
    window.clearTimeout(toastTimer.current);
    const toast = document.getElementById("toast");
    if (focusFallback && toast?.contains(document.activeElement)) {
      const screen = stateRef.current.screen;
      focusSoon(screen === "day" ? "day-title" : "week-title");
    }
    update({ toast: false });
  }

  function go(screen: Screen, focusId?: string) {
    update({ screen, menuId: null, trackX: trackXFor(screen), trackLive: false });
    if (focusId) focusSoon(focusId);
  }

  function setItem(id: string, next: ItemState, extra: Partial<JournalState> = {}) {
    update({
      ...extra,
      items: { ...stateRef.current.items, [id]: next },
    });
  }

  const actions: JournalActions = {
    restart() {
      undoRef.current = [];
      window.clearTimeout(toastTimer.current);
      dragRef.current = null;
      gesture.current = null;
      update({
        screen: "home",
        items: freshItems(),
        playing: false,
        tab: "synthesis",
        menuId: null,
        toast: false,
        drag: null,
        trackX: 0,
        trackLive: false,
      });
      const phone = phoneRef.current;
      if (phone) resetScroll(phone);
      focusSoon("home-title");
    },
    openNote() {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      go("note", "note-title");
    },
    openWeek() {
      go("week", "week-title");
    },
    openHome() {
      go("home", "home-title");
    },
    openDay() {
      returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      go("day", "day-title");
    },
    backFromNote() {
      go("home");
      const back = returnFocus.current ?? document.querySelector<HTMLElement>('[data-blob="meetings"]');
      requestAnimationFrame(() => back?.focus());
    },
    backFromDay() {
      go("week");
      const back = returnFocus.current ?? document.querySelector<HTMLElement>("[data-open-day]");
      requestAnimationFrame(() => back?.focus({ preventScroll: true }));
    },
    pulseMic() {
      update({ pulse: stateRef.current.pulse + 1 });
    },
    togglePlay() {
      update({ playing: !stateRef.current.playing });
    },
    selectTab(id: string) {
      update({ tab: id });
    },
    accept(id: string) {
      const item = stateRef.current.items[id];
      if (!item || item.place !== "fri") return;
      setItem(id, { ...item, suggestion: "accepted" });
    },
    dismiss(id: string) {
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
        if (item?.place === "fri" && item.suggestion === "pending") {
          items[meta.id] = { ...item, suggestion: "accepted" };
        }
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
    toggleMenu(id: string) {
      if (stateRef.current.menuId === id) {
        update({ menuId: null });
        document.getElementById(`move-${id}`)?.focus();
        return;
      }
      update({ menuId: id });
    },
    chooseMove(id: string, dest: string) {
      update({ menuId: null });
      if (dest === "letgo") {
        const item = stateRef.current.items[id];
        if (!item) return;
        undoRef.current.push(id);
        setItem(id, { place: "gone", suggestion: "pending" }, { toast: true, menuId: null });
        armToast();
        return;
      }
      if (!isDayId(dest)) return;
      const item = stateRef.current.items[id];
      if (!item) return;
      setItem(id, { place: dest as DayId, suggestion: "pending" }, { menuId: null });
    },
  };

  useEffect(() => {
    const node = phoneRef.current;
    if (!node) return;
    // `node` is an alias of the ref, so nested handlers still see it as nullable.
    const phone: HTMLDivElement = node;

    const write = (patch: Partial<JournalState>) => updateRef.current(patch);

    function beginSwipe(event: PointerEvent) {
      const screen = stateRef.current.screen;
      if (screen !== "home" && screen !== "week") return;
      if (dragRef.current) return;
      const target = event.target instanceof Element ? event.target : null;
      if (!target) return;
      if (screen === "week" && !target.closest(".week-head, [data-open-home]")) return;
      if (target.closest(".tray, [role='menu']")) return;
      gesture.current = {
        pointer: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        origin: trackXFor(screen),
        mode: "undecided",
      };
    }

    function moveSwipe(event: PointerEvent) {
      const current = gesture.current;
      if (!current || event.pointerId !== current.pointer) return;
      const dx = (event.clientX - current.x) / scaleOf(phone);
      const dy = (event.clientY - current.y) / scaleOf(phone);
      if (current.mode === "undecided") {
        if (Math.hypot(dx, dy) < 8) return;
        current.mode = Math.abs(dx) > Math.abs(dy) ? "swipe" : "ignore";
        if (current.mode === "swipe") {
          try {
            phone.setPointerCapture(event.pointerId);
          } catch {
            // pointer already released
          }
        }
      }
      if (current.mode !== "swipe") return;
      const x = Math.min(0, Math.max(-phoneWidth, current.origin + dx));
      write({ trackX: x, trackLive: true });
    }

    function endSwipe(event: PointerEvent) {
      const current = gesture.current;
      if (!current || event.pointerId !== current.pointer) return;
      gesture.current = null;
      if (current.mode !== "swipe") return;
      suppressClick.current = true;
      const dx = (event.clientX - current.x) / scaleOf(phone);
      const x = Math.min(0, Math.max(-phoneWidth, current.origin + dx));
      const traveled = Math.abs(x - current.origin) / phoneWidth;
      let screen: Screen;
      if (traveled > 0.3) screen = x < current.origin - 1 ? "week" : "home";
      else screen = current.origin < -phoneWidth / 2 ? "week" : "home";
      // keep the finger position for one frame, then glide to the snap point
      write({ trackX: x, trackLive: true });
      requestAnimationFrame(() => {
        write({ screen, trackX: trackXFor(screen), trackLive: false, menuId: null });
        focusSoon(screen === "week" ? "week-title" : "home-title");
      });
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
      const dx = event.clientX - current.x;
      const dy = event.clientY - current.y;
      if (!current.active) {
        if (Math.hypot(dx, dy) < 6) return;
        current.active = true;
      }
      const rect = phone.getBoundingClientRect();
      const scale = scaleOf(phone);
      const overBin = pointerOverBin(event.clientX, event.clientY);
      const column = overBin ? null : columnAt(event.clientX, event.clientY);
      write({
        drag: {
          id: current.id,
          active: true,
          x: (event.clientX - rect.left) / scale,
          y: (event.clientY - rect.top) / scale,
          hotDay: column?.dataset.day ?? null,
          overBin,
        },
      });
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
      const metaId = current.id;
      const dropping = pointerOverBin(x, y);
      const day = dropping ? null : columnAt(x, y)?.dataset.day;
      write({ drag: null });
      if (dropping) {
        const item = stateRef.current.items[metaId];
        if (!item) return;
        undoRef.current.push(metaId);
        write({
          items: { ...stateRef.current.items, [metaId]: { place: "gone", suggestion: "pending" } },
          toast: true,
          drag: null,
        });
        armToast();
        return;
      }
      if (day && isDayId(day)) {
        const item = stateRef.current.items[metaId];
        if (!item) return;
        write({
          items: { ...stateRef.current.items, [metaId]: { place: day, suggestion: "pending" } },
          drag: null,
        });
      }
    }

    const onDown = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const row = target?.closest<HTMLElement>("[data-chip]");
      if (row && stateRef.current.screen === "week") beginDrag(event, row);
      else beginSwipe(event);
    };
    const onMove = (event: PointerEvent) => {
      moveDrag(event);
      moveSwipe(event);
    };
    const onUp = (event: PointerEvent) => {
      if (dragRef.current?.pointer === event.pointerId) endDrag(true, event.clientX, event.clientY);
      endSwipe(event);
    };
    const onCancel = (event: PointerEvent) => {
      if (dragRef.current?.pointer === event.pointerId) endDrag(false);
      endSwipe(event);
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
        if (dragRef.current) endDrag(false);
        const menuId = stateRef.current.menuId;
        if (menuId) {
          write({ menuId: null });
          document.getElementById(`move-${menuId}`)?.focus();
        }
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

    const scroller = phone.querySelector<HTMLElement>("#day-scroller");
    let scrollDrag: { pointer: number; x: number; left: number; moved: boolean } | null = null;
    const onScrollDown = (event: PointerEvent) => {
      if (!scroller || event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest("button")) return;
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
    phone.addEventListener("click", onClick);
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
      phone.removeEventListener("click", onClick);
      phone.removeEventListener("contextmenu", onMenu);
      document.removeEventListener("pointerdown", onDocDown);
      document.removeEventListener("keydown", onKey);
      scroller?.removeEventListener("pointerdown", onScrollDown);
      scroller?.removeEventListener("pointermove", onScrollMove);
      scroller?.removeEventListener("pointerup", onScrollEnd);
      scroller?.removeEventListener("pointercancel", onScrollEnd);
      window.clearTimeout(toastTimer.current);
    };
  }, [phoneRef]);

  // focus the first menu item once it is open
  useEffect(() => {
    if (!state.menuId) return;
    document.querySelector<HTMLButtonElement>(`#menu-${state.menuId} [role="menuitem"]`)?.focus();
  }, [state.menuId]);

  return { state, actions };
}
