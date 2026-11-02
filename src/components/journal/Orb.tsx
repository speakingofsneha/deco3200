// a grainy gradient orb. colours come from the design system;
// the black dots inside are the note's parked loose ends.
import { useId } from "react";
import type { OrbColor } from "../../data/story";

const hex: Record<OrbColor, string> = {
  rose: "#c4899d",
  apricot: "#efb177",
  sky: "#b6d3db",
  sage: "#cfd2a5",
  cream: "#f1dfb9",
};

// three soft, uneven outlines so no two orbs match
const shapes = [
  "M30 66 C24 40 58 28 86 34 C104 22 136 22 156 38 C178 52 176 84 152 96 C130 108 100 102 84 104 C56 108 34 92 30 66Z",
  "M34 60 C36 36 66 30 92 36 C116 28 150 30 164 50 C176 70 160 94 132 98 C110 104 92 98 72 102 C48 104 32 84 34 60Z",
  "M38 70 C28 48 50 30 80 32 C100 34 112 26 136 30 C164 36 178 62 162 82 C148 100 120 98 98 100 C70 104 46 94 38 70Z",
];

// where the dots sit for one, two or three loose ends
const dotSpots: [number, number][][] = [
  [],
  [[100, 64]],
  [
    [80, 60],
    [126, 70],
  ],
  [
    [76, 62],
    [104, 74],
    [132, 58],
  ],
];

interface Props {
  colors: [OrbColor, OrbColor];
  dots: number;
  variant?: number;
  seed?: number;
  className?: string;
}

export default function Orb({ colors, dots, variant = 0, seed = 3, className }: Props) {
  const raw = useId().replace(/[^a-zA-Z0-9]/g, "");
  const grad = `g${raw}`;
  const grain = `f${raw}`;
  const [inner, outer] = colors;
  const spots = dotSpots[Math.max(0, Math.min(3, dots))];
  const first = spots[0];

  return (
    <svg className={className} viewBox="0 0 200 130" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={grad} cx="44%" cy="48%" r="62%">
          <stop offset="0" stopColor={hex[inner]} />
          <stop offset="0.42" stopColor={hex[inner]} />
          <stop offset="1" stopColor={hex[outer]} />
        </radialGradient>
        <filter id={grain} x="-30%" y="-40%" width="160%" height="180%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="soft" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="16" result="wide" />
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={seed} result="noise" />
          <feColorMatrix in="noise" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 7 -3.2" result="speck" />
          <feComposite in="wide" in2="speck" operator="in" result="halo" />
          <feComposite in="soft" in2="speck" operator="arithmetic" k1="0" k2="1" k3="-0.32" k4="0" result="body" />
          <feMerge result="merged">
            <feMergeNode in="halo" />
            <feMergeNode in="body" />
          </feMerge>
          <feColorMatrix in="merged" type="saturate" values="1.3" />
        </filter>
      </defs>
      <path className="orb-body" d={shapes[variant % shapes.length]} fill={`url(#${grad})`} filter={`url(#${grain})`} />
      {spots.length > 1 && (
        <path
          className="orb-thread"
          d={`M${spots[0][0]} ${spots[0][1]} ${spots
            .slice(1)
            .map(([x, y], i) => `Q${(spots[i][0] + x) / 2} ${Math.min(spots[i][1], y) - 14} ${x} ${y}`)
            .join(" ")}`}
          fill="none"
          stroke="#111210"
          strokeWidth="0.6"
          strokeLinecap="round"
          opacity="0.7"
        />
      )}
      {first && (
        <g className="orb-orbit" fill="none" stroke="#111210" strokeWidth="0.6" strokeLinecap="round" opacity="0.75" transform={`rotate(-14 ${first[0]} ${first[1]})`}>
          <path d={`M${first[0] - 15} ${first[1]} a15 9 0 1 1 3 6`} />
          <path d={`M${first[0] - 12} ${first[1] + 3} a14 8.5 0 1 0 1 -7`} />
        </g>
      )}
      {spots.map(([x, y], i) => (
        <circle key={i} className="orb-dot" cx={x} cy={y} r="3.2" fill="#111210" style={{ animationDelay: `${0.5 + i * 0.35}s` }} />
      ))}
    </svg>
  );
}
