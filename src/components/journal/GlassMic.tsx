// record control. it only pulses, it does not record.
import { useEffect, useRef } from "react";

interface Props {
  label: string;
  pulse: number;
  onPulse: () => void;
}

export default function GlassMic({ label, pulse, onPulse }: Props) {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const mic = ref.current;
    if (!mic || pulse === 0) return;
    mic.classList.remove("is-pulsing");
    void mic.offsetWidth;
    mic.classList.add("is-pulsing");
  }, [pulse]);

  return (
    <button ref={ref} type="button" className="mic" id="mic" aria-label={label} onClick={onPulse}>
      <img src="/assets/mic.svg" width={24} height={24} alt="" />
    </button>
  );
}
