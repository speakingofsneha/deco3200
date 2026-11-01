// the phone, and the glass card behind it.
import type { CSSProperties, ReactNode, Ref } from "react";

const frame = {
  radius: 10,
  border: 1,
  shadow: 10,
};

const glass = {
  radius: 12,
  spread: 10,
  blur: 100,
  fill: "rgb(100 100 100 / 30%)",
};

interface Props {
  phoneRef: Ref<HTMLDivElement>;
  dragging?: boolean;
  children: ReactNode;
}

export default function MobileFrame({ phoneRef, dragging = false, children }: Props) {
  const phoneStyle = {
    borderRadius: frame.radius,
    border: `${frame.border}px solid rgb(17 18 16 / 8%)`,
    boxShadow: `0 18px ${frame.shadow}px rgb(72 56 36 / 16%)`,
    background: "var(--color-canvas)",
  } as CSSProperties;

  const glassStyle = {
    inset: -glass.spread,
    borderRadius: glass.radius,
    background: glass.fill,
    backdropFilter: `blur(${glass.blur}px) saturate(1.4)`,
    WebkitBackdropFilter: `blur(${glass.blur}px) saturate(1.4)`,
    border: "1px solid rgb(200 200 200 / 62%)",
  } as CSSProperties;

  return (
    <div className="phone-slot">
      <div className="phone-scale">
        <div className="glass-mat" style={glassStyle} aria-hidden="true" />
        <div ref={phoneRef} className={dragging ? "phone is-dragging" : "phone"} id="phone" style={phoneStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
