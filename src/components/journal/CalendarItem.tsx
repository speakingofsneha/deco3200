// one event card. imported, suggested, or a note dropped on the week.
import { calColors, type CalColor } from "../../data/story";
import SourceTag from "./SourceTag";

interface Props {
  variant: "note" | "imported" | "suggested";
  title: string;
  itemId: string;
  color?: CalColor;
  time?: string;
  source?: "gcal" | "notion";
  sourceName?: string;
  week?: boolean;
  accepted?: boolean;
  height?: number;
  accessibleName?: string;
  acceptLabel?: string;
  dismissLabel?: string;
  onAccept?: () => void;
  onDismiss?: () => void;
}

export default function CalendarItem({
  variant,
  title,
  itemId,
  color,
  time,
  source,
  sourceName,
  week = false,
  accepted = false,
  height,
  accessibleName,
  acceptLabel,
  dismissLabel,
  onAccept,
  onDismiss,
}: Props) {
  const classes = ["cal-item", `cal-item--${variant}`, week ? "cal-item--week" : "", accepted ? "is-accepted" : ""]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      data-item={itemId}
      style={{ ...(height ? { height } : {}), ...(color ? { "--cal": calColors[color].hex } : {}) } as React.CSSProperties}
      role={variant === "imported" ? "group" : undefined}
      aria-disabled={variant === "imported" ? true : undefined}
      aria-label={variant === "imported" ? accessibleName : undefined}
    >
      <div className="cal-copy">
        <p className="cal-title">{title}</p>
        {time && <p className="cal-time">{time}</p>}
        {variant === "imported" && source && sourceName && <SourceTag source={source} name={sourceName} />}
      </div>
      {variant === "suggested" && !accepted && (
        <div className="cal-actions">
          <button type="button" className="icon-btn" data-accept={itemId} aria-label={acceptLabel} onClick={onAccept}>
            <img src="/assets/check.svg" width={17} height={17} alt="" />
          </button>
          <button type="button" className="icon-btn" data-dismiss={itemId} aria-label={dismissLabel} onClick={onDismiss}>
            <img src="/assets/close.svg" width={17} height={17} alt="" />
          </button>
        </div>
      )}
    </div>
  );
}
