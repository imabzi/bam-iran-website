"use client";

import { Children, useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { directionOf } from "@/lib/i18n";
import { useLanguage, usePrefersReducedMotion } from "@/lib/usePreferences";
import { ChevronIcon } from "./Icons";

const DRAG_THRESHOLD = 6; // px of movement before a press becomes a drag
const SNAP_SETTLE = 450; // ms to wait for a smooth snap before snapping is re-enabled

/**
 * A horizontally draggable carousel whose items are arranged in columns of
 * `rows` cards. All rows live in one scrolling track, so they always move
 * together.
 *
 * - Touch: native horizontal scrolling with snap points; vertical page
 *   scrolling is untouched.
 * - Mouse: press and drag, then a smooth snap to the nearest column. A drag
 *   past the threshold cancels the click, so dragging never opens a card.
 * - Keyboard: previous/next buttons; focusing a card scrolls it into view.
 * - Direction: follows the document, so RTL starts at the right.
 * - Below 768px, CSS turns each card into its own snap item (one per swipe).
 */
export function DragCarousel({ children, label, rows = 2 }: { children: ReactNode; label: string; rows?: number }) {
  const { language, t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const rtl = directionOf(language) === "rtl";
  const track = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; scroll: number; moved: boolean; pointer: number } | null>(null);
  const suppressClick = useRef(false);
  const settleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [dragging, setDragging] = useState(false);
  const [edges, setEdges] = useState({ start: true, end: true });

  const items = Children.toArray(children);
  const columns: ReactNode[][] = [];
  for (let index = 0; index < items.length; index += rows) columns.push(items.slice(index, index + rows));

  const updateEdges = useCallback(() => {
    const element = track.current;
    if (!element) return;
    // scrollLeft is 0 at the start in both directions, and negative in RTL.
    const position = Math.abs(element.scrollLeft);
    const max = element.scrollWidth - element.clientWidth;
    setEdges({ start: position <= 2, end: position >= max - 2 });
  }, []);

  useEffect(() => {
    updateEdges();
    const element = track.current;
    if (!element) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(element);
    return () => observer.disconnect();
  }, [updateEdges, items.length]);

  useEffect(() => () => { if (settleTimer.current) clearTimeout(settleTimer.current); }, []);

  // Distance of each snap item from the track's start edge, in reading order.
  const snapOffsets = () => {
    const element = track.current;
    if (!element) return [];
    const box = element.getBoundingClientRect();
    return Array.from(element.querySelectorAll<HTMLElement>("[data-snap]"))
      .filter((item) => getComputedStyle(item).scrollSnapAlign !== "none" && item.offsetParent !== null)
      .map((item) => {
        const rect = item.getBoundingClientRect();
        return rtl ? box.right - rect.right : rect.left - box.left;
      });
  };

  const scrollByLogical = (distance: number) => {
    const element = track.current;
    if (!element || Math.abs(distance) < 1) return;
    element.scrollBy({ left: rtl ? -distance : distance, behavior: reducedMotion ? "auto" : "smooth" });
  };

  const step = (direction: 1 | -1) => {
    const offsets = snapOffsets();
    const target = direction === 1 ? offsets.find((offset) => offset > 2) : [...offsets].reverse().find((offset) => offset < -2);
    if (target !== undefined) scrollByLogical(target);
  };

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    // Touch and pen use native scrolling; only the mouse needs drag handling.
    if (event.pointerType !== "mouse" || event.button !== 0 || !track.current) return;
    suppressClick.current = false;
    drag.current = { x: event.clientX, scroll: track.current.scrollLeft, moved: false, pointer: event.pointerId };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    const element = track.current;
    if (!state || !element) return;
    const distance = event.clientX - state.x;
    if (!state.moved) {
      if (Math.abs(distance) < DRAG_THRESHOLD) return;
      state.moved = true;
      suppressClick.current = true;
      // Capture only once it is a drag, so a plain click still reaches the link.
      element.setPointerCapture(state.pointer);
      if (settleTimer.current) clearTimeout(settleTimer.current);
      setDragging(true);
    }
    element.scrollLeft = state.scroll - distance;
  }

  function endDrag() {
    const state = drag.current;
    drag.current = null;
    if (!state?.moved) return;
    setDragging(false);
    // Snap to the nearest column; scroll snapping stays off until it settles.
    const offsets = snapOffsets();
    if (offsets.length) {
      const nearest = offsets.reduce((best, offset) => (Math.abs(offset) < Math.abs(best) ? offset : best), offsets[0]);
      track.current?.classList.add("is-settling");
      scrollByLogical(nearest);
      settleTimer.current = setTimeout(() => track.current?.classList.remove("is-settling"), reducedMotion ? 0 : SNAP_SETTLE);
    }
  }

  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!suppressClick.current) return;
    event.preventDefault();
    event.stopPropagation();
    suppressClick.current = false;
  }

  const scrollable = !(edges.start && edges.end);

  return (
    <div className="drag-carousel" role="region" aria-roledescription="carousel" aria-label={label}>
      <div
        ref={track}
        className={dragging ? "drag-track is-dragging" : "drag-track"}
        style={{ ["--carousel-rows" as string]: rows }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onClickCapture={onClickCapture}
        onDragStart={(event) => event.preventDefault()}
        onScroll={updateEdges}
      >
        {columns.map((column, index) => (
          <div className="drag-column" data-snap key={index}>
            {column.map((item, cell) => (
              <div className="drag-cell" data-snap key={cell}>
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
      {scrollable && (
        <div className="drag-controls">
          <button type="button" className="drag-arrow drag-arrow-previous" aria-label={t.carouselPrevious} disabled={edges.start} onClick={() => step(-1)}>
            <ChevronIcon />
          </button>
          <button type="button" className="drag-arrow" aria-label={t.carouselNext} disabled={edges.end} onClick={() => step(1)}>
            <ChevronIcon />
          </button>
        </div>
      )}
    </div>
  );
}
