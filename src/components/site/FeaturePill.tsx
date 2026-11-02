// a small pill under a phone. it opens a sheet that explains the feature.
import { url } from "../../lib/path";
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
              <img src={url("/assets/close.svg")} width={12} height={12} alt="" />
            </button>
            <h3 id={headingId} className="font-serif text-[1.5rem] leading-[1.875rem] text-ink sm:text-[1.75rem] sm:leading-[2.125rem]">
              {title}
            </h3>
            <div className="mt-5 flex flex-col gap-4 font-sans text-[1rem] leading-[1.6] text-body sm:text-[1.0625rem]">
              {body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {refs && refs.length > 0 && (
              <ul className="mt-7 flex list-none flex-col gap-1.5 border-t border-line-soft p-0 pt-4 font-sans text-[0.8125rem] leading-[1.45] text-ink-muted">
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
