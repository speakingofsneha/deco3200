// one event card. imported, suggested, or a note dropped on the week.
import SourceTag from "./SourceTag";

interface Props {
  variant: "note" | "imported" | "suggested";
  title: string;
  itemId: string;
  color?: string;
  tint?: "sky" | "cream";
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
  tint,
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
      data-color={color}
      data-tint={tint}
      data-item={itemId}
      style={height ? { height } : undefined}
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
