// the phone, and the glass card behind it.
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react";

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

// the app is drawn at 402px wide. on desktop it is scaled to fit its frame;
// on phones it fills the screen width, and its height stretches to the screen
// (never shorter than `minHeight`, so Home always fits).
const design = { width: 402, height: 874, minHeight: 680, maxHeight: 960 };

function useFit(slotRef: React.RefObject<HTMLDivElement | null>) {
  const [fit, setFit] = useState({ scale: 1, height: design.height, left: 0, phone: false });

  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return;
    const measure = () => {
      const phone = window.matchMedia("(max-width: 540px)").matches;
      if (phone) {
        const vw = window.innerWidth;
        const vh = window.visualViewport?.height ?? window.innerHeight;
        let scale = vw / design.width;
        const height = Math.min(design.maxHeight, Math.max(design.minHeight, vh / scale));
        // a very short screen: shrink to fit and centre
        scale = Math.min(scale, vh / height);
        const left = (vw - design.width * scale) / 2;
        setFit({ scale, height, left, phone });
      } else {
        const width = slot.getBoundingClientRect().width;
        setFit({ scale: width / design.width, height: design.height, left: 0, phone });
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(slot);
    window.addEventListener("resize", measure);
    window.visualViewport?.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
      window.visualViewport?.removeEventListener("resize", measure);
    };
  }, [slotRef]);

  return fit;
}

export default function MobileFrame({ phoneRef, dragging = false, children }: Props) {
  const slotRef = useRef<HTMLDivElement>(null);
  const fit = useFit(slotRef);
  const scaleStyle = {
    "--H": `${fit.height}px`,
    height: fit.height,
    left: fit.left,
    transform: `scale(${fit.scale})`,
  } as CSSProperties;

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
    <div ref={slotRef} className={fit.phone ? "phone-slot is-phone" : "phone-slot"}>
      <div className="phone-scale" style={scaleStyle}>
        <div className="glass-mat" style={glassStyle} aria-hidden="true" />
        <div ref={phoneRef} className={dragging ? "phone is-dragging" : "phone"} id="phone" style={phoneStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}
