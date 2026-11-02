// a small pill under a phone. it opens a sheet that explains the feature.
import { useEffect, useId, useRef, useState } from "react";

interface Props {
  label: string;
  title: string;
  body: string[];
  refs?: string[];
}

export default function FeaturePill({ label, title, body, refs }: Props) {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const headingId = useId();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    close.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        // only one focusable control in the sheet, so keep focus on it.
        e.preventDefault();
        close.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      trigger.current?.focus();
    };
  }, [open]);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="pill"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <span>{label}</span>
        <span className="pill-plus" aria-hidden="true">+</span>
      </button>

      {open && (
        <div className="sheet-backdrop" onClick={() => setOpen(false)}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby={headingId}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={close}
              type="button"
              className="sheet-close"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <img src="/assets/close.svg" width={14} height={14} alt="" />
            </button>
            <h3 id={headingId} className="font-serif text-[2rem] leading-[2.5rem] text-ink">
              {title}
            </h3>
            <div className="mt-8 flex flex-col gap-6 font-sans text-[1.25rem] leading-[1.875rem] text-body">
              {body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {refs && refs.length > 0 && (
              <ul className="mt-10 flex list-none flex-col gap-2 border-t border-line-soft p-0 pt-5 font-sans text-footnote text-ink-muted">
                {refs.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  );
}
